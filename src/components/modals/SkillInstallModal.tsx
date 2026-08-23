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

const skills = [
  {
    id: 'cuenti-mcp-erp',
    title: 'Cuenti MCP ERP',
    description:
      'Productos, terceros, documentos, cartera y operaciones del ERP.',
    files: [
      'SKILL.md',
      'references/endpoints.md',
      'references/mcp-guide.md',
      'references/catalogos.md',
    ],
  },
  {
    id: 'cuenti-mcp-stats',
    title: 'Cuenti Stats MCP',
    description:
      'Indicadores, KPIs y reportes de ventas, inventario y operación.',
    files: ['SKILL.md', 'references/tools.md', 'references/mcp-guide.md'],
  },
] as const;

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
  if (!open) return null;

  const installCommand = (skill: (typeof skills)[number], directory: string) =>
    `mkdir -p ${directory}/references && ${skill.files
      .map((file) => {
        const url = new URL(`skills/${skill.id}/${file}`, document.baseURI)
          .href;
        return `curl -fsSL '${url}' -o ${directory}/${file}`;
      })
      .join(' && ')}`;

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
            <h2 id="skill-modal-title">Instalar skills MCP</h2>
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
          Descarga por separado la skill del ERP o la skill de indicadores y
          reportes. Cada paquete contiene únicamente su propio catálogo.
        </p>
        <div className="skill-downloads">
          {skills.map((skill) => {
            const packageUrl = new URL(
              `skills/${skill.id}.zip`,
              document.baseURI,
            ).href;
            return (
              <section className="skill-download-card" key={skill.id}>
                <div>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
                <a
                  className="skill-download"
                  href={packageUrl}
                  download={`${skill.id}.zip`}
                >
                  <DownloadIcon />
                  Descargar {skill.id}
                </a>
              </section>
            );
          })}
        </div>
        {skills.map((skill) => (
          <section className="skill-install-options" key={skill.id}>
            <h3>Instalar {skill.title}</h3>
            <section>
              <h4>Directorio compartido de Agent Skills</h4>
              <JsonCodeBlock
                value={installCommand(skill, `~/.agents/skills/${skill.id}`)}
                fallback=""
              />
            </section>
            <section>
              <h4>OpenCode global</h4>
              <JsonCodeBlock
                value={installCommand(
                  skill,
                  `~/.config/opencode/skills/${skill.id}`,
                )}
                fallback=""
              />
            </section>
          </section>
        ))}
        <p className="skill-restart-note">
          Reinicia el cliente de agentes para que detecte la nueva skill.
        </p>
      </section>
    </div>
  );
};
