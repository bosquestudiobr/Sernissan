export function AppFooter() {
  return (
    <footer className="mt-auto bg-[var(--sn-black)] text-white">
      <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 text-xs sm:flex-row lg:px-6">
        <p>© 2026 NISSAN | SERNISSAN - INDIVIDUANDO</p>
        <a href="#" className="hover:underline">
          Politica de Privacidade
        </a>
        <div className="flex items-center gap-3 opacity-80">
          <span aria-hidden>in</span>
          <span aria-hidden>yt</span>
          <span aria-hidden>fb</span>
        </div>
      </div>
    </footer>
  )
}
