import nlwUniteIcon from "./assets/Frame 7108.svg";

export function Header() {
  return (
    <div className="flex items-center gap-5">
      <img src={nlwUniteIcon} alt="LogoSistema" />
      <nav className="flex items-center gap-5">
        <a className="font-medium text-sm text-zinc-300" href="#">
          Eventos
        </a>
        <a className="font-medium text-sm" href="#">
          Participantes
        </a>
      </nav>
    </div>
  );
}
