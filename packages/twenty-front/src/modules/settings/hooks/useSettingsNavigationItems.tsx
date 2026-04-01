import { SettingsPath } from 'twenty-shared/types';

import { useAuth } from '@/auth/hooks/useAuth';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { supportChatState } from '@/client-config/states/supportChatState';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import { type NavigationDrawerItemIndentationLevel } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { t } from '@lingui/core/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useRecoilValue } from 'recoil';
import {
  IconApi,
  // IconApps, // TODO: Re-enable when integrations page is ready
  IconAt,
  IconCalendarEvent,
  IconColorSwatch,
  type IconComponent,
  IconCurrencyDollar,
  IconDoorEnter,
  IconHelpCircle,
  IconHierarchy2,
  IconKey,
  IconLock,
  IconMail,
  IconMessage,
  IconPlug,
  IconRocket,
  IconServer,
  IconSettings,
  IconSparkles,
  IconUserCircle,
  IconUsers,
  IconWorld,
} from 'twenty-ui/display';
import { PermissionFlagType } from '~/generated/graphql';

export type SettingsNavigationSection = {
  label: string;
  items: SettingsNavigationItem[];
  isAdvanced?: boolean;
};

export type SettingsNavigationItem = {
  label: string;
  path?: SettingsPath;
  onClick?: () => void;
  Icon: IconComponent;
  indentationLevel?: NavigationDrawerItemIndentationLevel;
  matchSubPages?: boolean;
  isHidden?: boolean;
  subItems?: SettingsNavigationItem[];
  isAdvanced?: boolean;
  soon?: boolean;
  isNew?: boolean;
};

const useSettingsNavigationItems = (): SettingsNavigationSection[] => {
  const { signOut } = useAuth();
  const supportChat = useRecoilValue(supportChatState);
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const currentUser = useRecoilValue(currentUserState);
  const isAdminEnabled =
    (currentUser?.canImpersonate || currentUser?.canAccessFullAdminPanel) ??
    false;
  const isSupportChatConfigured =
    supportChat?.supportDriver === 'FRONT' &&
    isNonEmptyString(supportChat.supportFrontChatId);

  const permissionMap = usePermissionFlagMap();
  return [
    {
      label: t`User`,
      items: [
        {
          label: t`Profile`,
          path: SettingsPath.ProfilePage,
          Icon: IconUserCircle,
        },
        {
          label: t`Experience`,
          path: SettingsPath.Experience,
          Icon: IconColorSwatch,
        },
        {
          label: t`Accounts`,
          path: SettingsPath.Accounts,
          Icon: IconAt,
          subItems: [
            {
              label: t`Emails`,
              path: SettingsPath.AccountsEmails,
              Icon: IconMail,
              indentationLevel: 2,
            },
            {
              label: t`Calendars`,
              path: SettingsPath.AccountsCalendars,
              Icon: IconCalendarEvent,
              indentationLevel: 2,
              isHidden: true,
            },
          ],
        },
      ],
    },
    {
      label: t`Workspace`,
      items: [
        {
          label: t`General`,
          path: SettingsPath.Workspace,
          Icon: IconSettings,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Data model`,
          path: SettingsPath.Objects,
          Icon: IconHierarchy2,
          isHidden: !permissionMap[PermissionFlagType.DATA_MODEL],
        },
        {
          label: t`Members`,
          path: SettingsPath.WorkspaceMembersPage,
          Icon: IconUsers,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE_MEMBERS],
        },
        {
          label: t`Roles`,
          path: SettingsPath.Roles,
          Icon: IconLock,
          isHidden: !permissionMap[PermissionFlagType.ROLES],
        },
        {
          label: t`Domains`,
          path: SettingsPath.Domains,
          Icon: IconWorld,
          isHidden: !permissionMap[PermissionFlagType.WORKSPACE],
        },
        {
          label: t`Billing`,
          path: SettingsPath.Billing,
          Icon: IconCurrencyDollar,
          isHidden: true,
        },
        {
          label: t`APIs & Webhooks`,
          path: SettingsPath.ApiWebhooks,
          Icon: IconApi,
          isHidden: !permissionMap[PermissionFlagType.API_KEYS_AND_WEBHOOKS],
        },
        // TODO: Re-enable when integrations page is ready
        // {
        //   label: t`Integrations`,
        //   path: SettingsPath.Integrations,
        //   Icon: IconApps,
        //   isHidden: !permissionMap[PermissionFlagType.API_KEYS_AND_WEBHOOKS],
        // },
        {
          label: t`Applications`,
          path: SettingsPath.Applications,
          Icon: IconPlug,
          isHidden: true,
          isNew: true,
        },
        {
          label: t`AI`,
          path: SettingsPath.AI,
          Icon: IconSparkles,
          isHidden: true,
          isNew: true,
        },
        {
          label: t`Security`,
          path: SettingsPath.Security,
          Icon: IconKey,
          isAdvanced: true,
          isHidden: !permissionMap[PermissionFlagType.SECURITY],
        },
      ],
    },
    {
      label: t`Other`,
      items: [
        {
          label: t`Admin Panel`,
          path: SettingsPath.AdminPanel,
          Icon: IconServer,
          isHidden: !isAdminEnabled,
        },
        {
          label: t`Updates`,
          path: SettingsPath.Updates,
          Icon: IconRocket,
          isHidden: true,
        },
        {
          label: t`Support`,
          onClick: () => window.FrontChat?.('show'),
          Icon: IconMessage,
          isHidden: !isSupportChatConfigured,
        },
        {
          label: t`Documentation`,
          onClick: () =>
            window.open(
              getDocumentationUrl({ locale: currentWorkspaceMember?.locale }),
              '_blank',
            ),
          Icon: IconHelpCircle,
        },
        {
          label: t`Logout`,
          onClick: signOut,
          Icon: IconDoorEnter,
          matchSubPages: false,
        },
      ],
    },
  ];
};

export { useSettingsNavigationItems };
