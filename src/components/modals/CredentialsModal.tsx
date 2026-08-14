import { Button } from '@cuenti-dna/react/button';
import { CloseX } from '@cuenti-dna/react/icons';
import { Input } from '@cuenti-dna/react/input';
import { Label } from '@cuenti-dna/react/label';
import { useEffect, useState } from 'react';
import type { Credentials } from '../../request';
import { DEFAULT_TIMEZONE } from '../../request';
import { useModal } from '../shared/useModal';

export const CredentialsModal = ({
  open,
  credentials,
  onChange,
  onClose,
}: {
  open: boolean;
  credentials: Credentials;
  onChange: (credentials: Credentials) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState(credentials);
  const modalRef = useModal(
    open,
    onClose,
    'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  useEffect(() => {
    if (open) setDraft(credentials);
  }, [credentials, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <button
        className="modal-dismiss"
        type="button"
        tabIndex={-1}
        aria-label="Cerrar configuración"
        onClick={onClose}
      />
      <section
        ref={modalRef}
        className="credentials-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credentials-modal-title"
      >
        <header className="credentials-modal-header">
          <div>
            <p className="eyebrow">Configuración global</p>
            <h2 id="credentials-modal-title">Contexto y credenciales</h2>
          </div>
          <button
            className="modal-close"
            type="button"
            aria-label="Cerrar configuración"
            onClick={onClose}
          >
            <CloseX aria-hidden="true" />
          </button>
        </header>
        <p className="credentials-modal-description">
          Estos valores se aplican a todas las solicitudes que realices desde
          esta guía.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange({
              ...credentials,
              company: draft.company,
              timezone: DEFAULT_TIMEZONE,
              token: draft.token,
              branch: draft.branch,
              employee: draft.employee,
            });
            onClose();
          }}
        >
          <div className="credentials-modal-grid">
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-company"
                required
              >
                Empresa
              </Label>
              <Input
                id="global-company"
                value={draft.company}
                onChange={(event) =>
                  setDraft({ ...draft, company: event.target.value })
                }
                autoComplete="off"
                autoFocus
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-timezone"
                required
              >
                Zona horaria
              </Label>
              <Input
                id="global-timezone"
                value={DEFAULT_TIMEZONE}
                readOnly
                autoComplete="off"
              />
            </div>
            <div className="field-label credentials-modal-token">
              <Label
                className="field-label-title"
                htmlFor="global-token"
                required
              >
                Token
              </Label>
              <Input
                id="global-token"
                type="password"
                value={draft.token}
                onChange={(event) =>
                  setDraft({ ...draft, token: event.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-branch"
                required
              >
                Sucursal
              </Label>
              <Input
                id="global-branch"
                value={draft.branch}
                onChange={(event) =>
                  setDraft({ ...draft, branch: event.target.value })
                }
                autoComplete="off"
              />
            </div>
            <div className="field-label">
              <Label
                className="field-label-title"
                htmlFor="global-employee"
                required
              >
                Empleado
              </Label>
              <Input
                id="global-employee"
                value={draft.employee}
                onChange={(event) =>
                  setDraft({ ...draft, employee: event.target.value })
                }
                autoComplete="off"
              />
            </div>
          </div>
          <footer className="credentials-modal-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Aceptar</Button>
          </footer>
        </form>
      </section>
    </div>
  );
};
