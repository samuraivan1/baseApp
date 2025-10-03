// Disabled in development: components should not depend on PermissionGate.
// Keeping a no-op export to avoid breaking imports if any remain.
export default function NoopPermissionGate(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}
