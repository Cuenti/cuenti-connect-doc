import { CloseX } from '@cuenti-dna/react/icons';
import { JsonCodeBlock } from '../../JsonCodeBlock';
import { useModal } from '../shared/useModal';

const DownloadIcon = () => (
  <svg
    aria-hidden="true"
    className="download-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
    <path d="M5 20h14" />
  </svg>
);

export const SkillInstallModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const modalRef = useModal(
    open,
    onClose,
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  const skillUrl = new URL('skills/cuenti-mcp/SKILL.md', document.baseURI).href;
  const catalogUrl = new URL(
    'skills/cuenti-mcp/references/endpoints.md',
    document.baseURI,
  ).href;
  const guideUrl = new URL(
    'skills/cuenti-mcp/references/mcp-guide.md',
    document.baseURI,
  ).href;
  const catalogsUrl = new URL(
    'skills/cuenti-mcp/references/catalogos.md',
    document.baseURI,
  ).href;
  const packageUrl = new URL('skills/cuenti-mcp.zip', document.baseURI).href;

  if (!open) return null;

  const installCommand = (directory: string) =>
    `mkdir -p ${directory}/references && curl -fsSL '${skillUrl}' -o ${directory}/SKILL.md && curl -fsSL '${catalogUrl}' -o ${directory}/references/endpoints.md && curl -fsSL '${guideUrl}' -o ${directory}/references/mcp-guide.md && curl -fsSL '${catalogsUrl}' -o ${directory}/references/catalogos.md`;
  const sharedInstall = installCommand('~/.agents/skills/cuenti-mcp');
  const openCodeInstall = installCommand(
    '~/.config/opencode/skills/cuenti-mcp',
  );

  return (
    <div className="modal-backdrop">
      <button
        className="modal-dismiss"
        type="button"
        tabIndex={-1}
        aria-label="Cerrar instalación"
        onClick={onClose}
      />
      <section
        ref={modalRef}
        className="credentials-modal skill-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-modal-title"
      >
        <header className="credentials-modal-header">
          <div>
            <p className="eyebrow">Agentes de IA</p>
            <h2 id="skill-modal-title">Instalar skill del MCP</h2>
          </div>
          <button
            className="modal-close"
            type="button"
            aria-label="Cerrar instalación"
            onClick={onClose}
          >
            <CloseX aria-hidden="true" />
          </button>
        </header>
        <p className="credentials-modal-description">
          Descarga un único paquete con las instrucciones, la guía de conexión,
          los catálogos y el catálogo funcional de las 28 herramientas.
        </p>
        <div className="skill-downloads">
          <a
            className="skill-download"
            href={packageUrl}
            download="cuenti-mcp.zip"
          >
            <DownloadIcon />
            Descargar skill
          </a>
        </div>
        <div className="skill-install-options">
          <section>
            <h3>Directorio compartido de Agent Skills</h3>
            <JsonCodeBlock value={sharedInstall} fallback="" />
          </section>
          <section>
            <h3>OpenCode global</h3>
            <JsonCodeBlock value={openCodeInstall} fallback="" />
          </section>
        </div>
        <p className="skill-restart-note">
          Reinicia el cliente de agentes para que detecte la nueva skill.
        </p>
      </section>
    </div>
  );
};
