import {SPFI} from '@pnp/sp';import '@pnp/sp/security';import '@pnp/sp/lists';import '@pnp/sp/items';import '@pnp/sp/fields';
import {PermissionKind} from '@pnp/sp/security';
export const settingsList='DevStoriesExtensionSettings';
export async function saveOwnerSettings(sp:SPFI,title:string,value:unknown):Promise<void>{
 if(!await sp.web.currentUserHasPermissions(PermissionKind.ManageWeb)||!await sp.web.currentUserHasPermissions(PermissionKind.ManagePermissions))throw new Error('Only site owners can change extension settings.');
 const {list}=await sp.web.lists.ensure(settingsList,'Owner-managed Dev Stories extension settings. No secrets.',100);
 if(!(await list.fields.filter("InternalName eq 'Configuration'").select('Id')()).length)await list.fields.addMultilineText('Configuration',{NumberOfLines:6,RichText:false});
 // Enforce owner-only writes in SharePoint, including direct list/API access.
 const info=await list.select('HasUniqueRoleAssignments')() as unknown as {HasUniqueRoleAssignments:boolean};if(!info.HasUniqueRoleAssignments)await list.breakRoleInheritance(true,false);
 const assignments=await list.roleAssignments.select('PrincipalId','RoleDefinitionBindings/Id','RoleDefinitionBindings/BasePermissions').expand('RoleDefinitionBindings')() as unknown as {PrincipalId:number;RoleDefinitionBindings:{Id:number;BasePermissions:{High:number;Low:number}}[]}[];
 const read=await sp.web.roleDefinitions.getByType(2).select('Id')();
 for(const assignment of assignments){const roles=assignment.RoleDefinitionBindings as {Id:number;BasePermissions:{High:number;Low:number}}[];
  if(roles.some(role=>list.hasPermissions(role.BasePermissions,PermissionKind.ManageWeb)&&list.hasPermissions(role.BasePermissions,PermissionKind.ManagePermissions)))continue;
  const writes=roles.filter(role=>[PermissionKind.AddListItems,PermissionKind.EditListItems,PermissionKind.DeleteListItems,PermissionKind.ManageLists,PermissionKind.ManagePermissions].some(p=>list.hasPermissions(role.BasePermissions,p)));
  if(!writes.length)continue;if(!roles.some(role=>role.Id===read.Id))await list.roleAssignments.add(assignment.PrincipalId,read.Id);for(const role of writes)await list.roleAssignments.remove(assignment.PrincipalId,role.Id);
 }
 const rows=await list.items.filter("Title eq '"+title+"'").select('Id').top(1)();const payload={Title:title,Configuration:JSON.stringify(value)};if(rows.length)await list.items.getById(rows[0].Id).update(payload);else await list.items.add(payload);
}
