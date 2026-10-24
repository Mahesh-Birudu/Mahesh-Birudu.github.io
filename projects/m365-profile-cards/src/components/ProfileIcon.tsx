import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
export const ProfileIcon:React.FC<{name:string}>=({name})=><Icon iconName={name} aria-hidden="true" className="m365-profile-icon"/>;
