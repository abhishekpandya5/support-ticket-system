import { useActingAsUser } from '../../hooks/users';

const ACTING_AS_SELECT_IDS = {
  inline: 'acting-as-user-header',
  stacked: 'acting-as-user-mobile',
} as const;

const headerSelectClassName =
  'max-w-[11rem] min-w-0 rounded-md border border-slate-300 bg-white py-1.5 pl-2.5 pr-8 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 sm:max-w-[12rem]';

const stackedSelectClassName =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50';

type ActingAsSelectorProps = {
  /** Inline for the fixed-height header; stacked for the mobile menu panel. */
  layout?: 'inline' | 'stacked';
};

export function ActingAsSelector({ layout = 'inline' }: ActingAsSelectorProps) {
  const {
    users,
    usersLoading,
    actingAsUserId,
    selectActingAsUser,
  } = useActingAsUser();

  const selectId = ACTING_AS_SELECT_IDS[layout];

  const select = (
    <select
      id={selectId}
      value={actingAsUserId ?? ''}
      onChange={(event) => selectActingAsUser(event.target.value)}
      disabled={usersLoading || users.length === 0}
      className={layout === 'inline' ? headerSelectClassName : stackedSelectClassName}
      aria-busy={usersLoading}
      aria-label="Acting as user"
    >
      {usersLoading ? <option value="">Loading users...</option> : null}
      {!usersLoading && users.length === 0 ? (
        <option value="">No users available</option>
      ) : null}
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );

  if (layout === 'stacked') {
    return (
      <div>
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Acting as
        </label>
        {select}
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <label
        htmlFor={selectId}
        className="shrink-0 text-sm font-medium text-slate-600"
      >
        Acting as
      </label>
      {select}
    </div>
  );
}
