export function EmptyCertificateState({ t }: { t: any }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {t.noUserData}
        </h1>
        <p className="text-neutral-700 dark:text-neutral-200 mt-2">
          {t.pleaseLogin}
        </p>
      </div>
    </div>
  );
}
