import { useRouter } from 'next/router';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useUser } from '../../../hooks/useUser';
import { Permission, hasPermission } from '../../../../server/lib/permissions';
import Error from '../../../pages/_error';
import LoadingSpinner from '../../Common/LoadingSpinner';
import PageTitle from '../../Common/PageTitle';
import ProfileHeader from '../ProfileHeader';
import useSettings from '../../../hooks/useSettings';
import Alert from '../../Common/Alert';
import SettingsTabs, { SettingsRoute } from '../../Common/SettingsTabs';

const messages = defineMessages({
  settings: 'User Settings',
  menuGeneralSettings: 'General Settings',
  menuChangePass: 'Password',
  menuNotifications: 'Notifications',
  menuPermissions: 'Permissions',
  unauthorized: 'Unauthorized',
  unauthorizedDescription:
    "You do not have permission to modify this user's settings.",
});

const UserSettings: React.FC = ({ children }) => {
  const router = useRouter();
  const settings = useSettings();
  const { user: currentUser } = useUser();
  const { user, error } = useUser({ id: Number(router.query.userId) });
  const intl = useIntl();

  if (!user && !error) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Error statusCode={500} />;
  }

  const settingsRoutes: SettingsRoute[] = [
    {
      text: intl.formatMessage(messages.menuGeneralSettings),
      route: `/users/${user?.id}/settings/main`,
      regex: /\/settings(\/main)?$/,
    },
    {
      text: intl.formatMessage(messages.menuChangePass),
      route: `/users/${user?.id}/settings/password`,
      regex: /\/settings\/password/,
      hidden:
        (!settings.currentSettings.localLogin &&
          !hasPermission(
            Permission.MANAGE_SETTINGS,
            currentUser?.permissions ?? 0
          )) ||
        (currentUser?.id !== 1 &&
          currentUser?.id !== user?.id &&
          hasPermission(Permission.ADMIN, user?.permissions ?? 0)),
    },
    {
      text: intl.formatMessage(messages.menuNotifications),
      route:
        settings.currentSettings.notificationsEnabled &&
        settings.currentSettings.emailEnabled
          ? `/users/${user?.id}/settings/notifications/email`
          : `/users/${user?.id}/settings/notifications/discord`,
      regex: /\/settings\/notifications/,
    },
    {
      text: intl.formatMessage(messages.menuPermissions),
      route: `/users/${user?.id}/settings/permissions`,
      regex: /\/settings\/permissions/,
      requiredPermission: Permission.MANAGE_USERS,
      hidden: currentUser?.id !== 1 && currentUser?.id === user.id,
    },
  ];

  if (currentUser?.id !== 1 && user.id === 1) {
    return (
      <>
        <PageTitle title={intl.formatMessage(messages.settings)} />
        <ProfileHeader user={user} isSettingsPage />
        <div className="mt-6">
          <Alert title={intl.formatMessage(messages.unauthorized)} type="error">
            {intl.formatMessage(messages.unauthorizedDescription)}
          </Alert>
        </div>
      </>
    );
  }

  const currentRoute = settingsRoutes.find(
    (route) => !!router.pathname.match(route.regex)
  )?.route;

  const finalRoute = router.asPath.includes('/profile')
    ? `/profile${currentRoute}`
    : `/users/${user.id}${currentRoute}`;

  return (
    <>
      <PageTitle title={intl.formatMessage(messages.settings)} />
      <ProfileHeader user={user} isSettingsPage />
      <div className="mt-6">
        <SettingsTabs
          settingsRoutes={settingsRoutes}
          defaultValue={finalRoute}
        />
      </div>
      <div className="mt-10 text-white">{children}</div>
    </>
  );
};

export default UserSettings;
