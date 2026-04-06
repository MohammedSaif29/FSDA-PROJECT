import Button from '../ui/Button';

export default function StudentEmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="rounded-2xl bg-white/[0.05] p-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel ? (
        <Button className="mt-5 rounded-full px-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
