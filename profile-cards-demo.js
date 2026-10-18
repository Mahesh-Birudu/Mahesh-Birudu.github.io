"use strict";
(() => {
  // src/models/Profile.ts
  function presenceDisplay(presence) {
    const states = {
      Available: { state: "available", label: "Available (online)" },
      AvailableIdle: { state: "away", label: "Available, idle" },
      Busy: { state: "busy", label: "Busy" },
      BusyIdle: { state: "busy", label: "Busy, idle" },
      DoNotDisturb: { state: "dnd", label: "Do not disturb" },
      Away: { state: "away", label: "Away" },
      BeRightBack: { state: "away", label: "Be right back" },
      Offline: { state: "offline", label: "Offline / appear offline" }
    };
    const base = states[presence?.availability || ""];
    if (!base) return { state: "unknown", label: "Presence unavailable" };
    const activities = { InACall: "In a call", InAMeeting: "In a meeting", Presenting: "Presenting", Focusing: "Focusing", OutOfOffice: "Out of office" };
    return { state: base.state, label: activities[presence?.activity || ""] || base.label };
  }
  var ProfileError = class extends Error {
    constructor(status) {
      super(status === 403 || status === 401 ? "Profile access is unavailable. Ask your administrator to check Microsoft Graph permissions." : status === 404 ? "This person could not be found in the directory." : status === 429 ? "The directory is busy. Try again shortly." : "The profile could not be loaded. Try again.");
      this.status = status;
      this.name = "ProfileError";
    }
  };
  function normalizeIdentity(value) {
    const identity = (value || "").trim().split("|").pop().trim();
    if (!identity || identity.length > 320 || /[\s/\\?\u0000-\u001f]/.test(identity)) throw new Error("A valid user ID or user principal name is required.");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identity) && !/^[^@]+@[^@]+\.[^@]+$/.test(identity)) throw new Error("Use a user principal name or Entra object ID.");
    return identity;
  }

  // src/ui/ProfileCardController.ts
  var ProfileCardController = class {
    constructor(host, provider2) {
      this.host = host;
      this.provider = provider2;
      this.generation = 0;
      this.click = (event) => {
        const target = event.target instanceof Element ? event.target : void 0;
        if (target?.closest(".js-profile-open")) this.open();
        if (target?.closest(".js-profile-close")) this.close();
        if (target?.closest(".js-profile-retry")) void this.load();
      };
      this.cancel = () => this.returnFocus?.focus();
    }
    connect() {
      this.host.addEventListener("click", this.click);
      this.dialog = this.host.querySelector(".js-profile-dialog") || void 0;
      this.dialog?.addEventListener("close", this.cancel);
      void this.load();
    }
    disconnect() {
      window.clearTimeout(this.presenceTimer);
      this.generation++;
      this.close();
      this.dialog?.removeEventListener("close", this.cancel);
      this.host.removeEventListener("click", this.click);
      this.revokePhoto();
    }
    text(selector, value) {
      this.host.querySelectorAll(selector).forEach((node) => {
        node.textContent = value;
      });
    }
    state(loading, error) {
      this.host.setAttribute("aria-busy", String(loading));
      this.text(".js-profile-status", loading ? "Loading profile\u2026" : error || "");
      this.host.querySelectorAll(".js-profile-open").forEach((button) => {
        button.disabled = loading || Boolean(error);
      });
      this.host.querySelectorAll(".js-profile-retry").forEach((button) => {
        button.hidden = !error;
      });
    }
    async load() {
      window.clearTimeout(this.presenceTimer);
      const generation = ++this.generation;
      this.state(true);
      this.revokePhoto();
      this.host.querySelectorAll(".js-profile-photo").forEach((image) => {
        image.hidden = true;
        image.removeAttribute("src");
      });
      this.host.querySelectorAll(".js-profile-initials").forEach((node) => {
        node.hidden = false;
      });
      try {
        const identity = normalizeIdentity(this.host.getAttribute("data-user-id") || "");
        const profile = await this.provider.getProfile(identity);
        if (generation !== this.generation || !this.host.isConnected) return;
        this.render(profile);
        this.state(false);
        void this.refreshPresence(profile.id, generation);
        const blob = await this.provider.getPhoto(identity);
        if (!blob || generation !== this.generation || !this.host.isConnected) return;
        if (!blob.type.startsWith("image/")) return;
        this.objectUrl = URL.createObjectURL(blob);
        this.host.querySelectorAll(".js-profile-photo").forEach((image) => {
          image.onload = () => {
            if (generation === this.generation) {
              image.hidden = false;
              this.host.querySelectorAll(".js-profile-initials").forEach((node) => {
                node.hidden = true;
              });
            }
          };
          image.onerror = () => {
            image.hidden = true;
          };
          image.src = this.objectUrl;
        });
      } catch (error) {
        if (generation !== this.generation || !this.host.isConnected) return;
        this.state(false, error instanceof Error ? error.message : "The profile could not be loaded.");
      }
    }
    async refreshPresence(userId, generation) {
      let display = presenceDisplay();
      try {
        if (document.visibilityState !== "hidden" && this.provider.getPresence) display = presenceDisplay(await this.provider.getPresence(userId));
      } catch {
      }
      if (generation !== this.generation || !this.host.isConnected) return;
      if (document.visibilityState !== "hidden") {
        this.host.querySelectorAll(".js-profile-presence").forEach((node) => {
          node.setAttribute("data-presence", display.state);
          node.setAttribute("aria-label", "Teams status: " + display.label);
        });
        this.text(".js-profile-presence-label", display.label);
      }
      if (this.provider.getPresence) this.presenceTimer = window.setTimeout(() => {
        void this.refreshPresence(userId, generation);
      }, 6e4);
    }
    render(profile) {
      const values = {
        name: profile.displayName || "Unnamed user",
        title: profile.jobTitle || "Job title not provided",
        email: profile.mail || profile.userPrincipalName || "",
        phone: profile.businessPhones?.filter(Boolean).join(", ") || profile.mobilePhone || "",
        company: profile.companyName || "",
        department: profile.department || "",
        mobile: profile.mobilePhone || "",
        office: profile.officeLocation || "",
        upn: profile.userPrincipalName || "",
        address: [profile.streetAddress, profile.city, profile.state, profile.postalCode, profile.country].filter(Boolean).join(", ")
      };
      Object.keys(values).forEach((key) => this.text(".js-profile-" + key, values[key] || "Not provided"));
      this.text(".js-profile-initials", values.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase());
      this.host.querySelectorAll(".js-profile-email-link").forEach((link) => {
        const email = values.email;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          link.href = "mailto:" + encodeURIComponent(email);
          link.removeAttribute("aria-disabled");
        } else {
          link.removeAttribute("href");
          link.setAttribute("aria-disabled", "true");
        }
      });
      this.host.querySelectorAll(".js-profile-open").forEach((button) => button.setAttribute("aria-label", "View profile for " + values.name));
    }
    open() {
      if (!this.dialog || this.dialog.open) return;
      this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
      this.dialog.showModal();
    }
    close() {
      if (this.dialog?.open) this.dialog.close();
    }
    revokePhoto() {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = void 0;
      }
    }
  };

  // preview/fixtures.ts
  var people = [
    { id: "jenny@example.test", userPrincipalName: "jenny@example.test", displayName: "Jenny Wilson", mail: "jenny@example.test", jobTitle: "Chief Executive Officer", companyName: "Contoso Studio", department: "Leadership", businessPhones: ["+1 555 010 0123"], mobilePhone: "+1 555 010 0456", officeLocation: "Seattle \xB7 HQ", city: "Seattle", country: "United States" },
    { id: "alex@example.test", userPrincipalName: "alex@example.test", displayName: "Alex Morgan", mail: "alex@example.test", jobTitle: "SharePoint Developer", companyName: "Contoso Studio", department: "Digital Workplace", businessPhones: ["+1 555 010 0789"], officeLocation: "Remote" },
    { id: "sam@example.test", userPrincipalName: "sam@example.test", displayName: "Sam Lee", jobTitle: "", companyName: "" },
    { id: "denied@example.test", displayName: "Restricted profile" }
  ];
  var MockProfileProvider = class {
    async getPresence(identity) {
      return identity.startsWith("jenny") ? { availability: "Available" } : identity.startsWith("alex") ? { availability: "Busy", activity: "InAMeeting" } : { availability: "Offline" };
    }
    async getProfile(identity) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (identity === "denied@example.test") throw new ProfileError(403);
      const profile = people.find((person) => person.id === identity);
      if (!profile) throw new ProfileError(404);
      return profile;
    }
    async getPhoto() {
      return void 0;
    }
  };

  // preview/main.ts
  var provider = new MockProfileProvider();
  var PreviewCard = class extends HTMLElement {
    connectedCallback() {
      this.controller = new ProfileCardController(this, provider);
      this.controller.connect();
    }
    disconnectedCallback() {
      this.controller?.disconnect();
    }
  };
  customElements.define("m365-profile-card", PreviewCard);
})();
