import { HelperText } from '@cuenti-dna/react/helper-text';
import { Input } from '@cuenti-dna/react/input';
import { Label } from '@cuenti-dna/react/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cuenti-dna/react/select';
import type { ParameterSpec } from '../../model';

export const ParameterInputs = ({
  title,
  idPrefix,
  parameters,
  values,
  onChange,
}: {
  title: string;
  idPrefix: string;
  parameters: ParameterSpec[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) => {
  if (parameters.length === 0) return null;
  return (
    <fieldset className="try-fieldset">
      <legend>{title}</legend>
      <div className="form-grid">
        {parameters.map((parameter) => {
          const hintId = `${idPrefix}-${parameter.name}-hint`;
          return (
            <div key={parameter.name} className="field-label">
              <Label
                className="field-label-title"
                htmlFor={`${idPrefix}-${parameter.name}`}
                required={parameter.required}
              >
                {parameter.name}
              </Label>
              {parameter.allowedValues?.length ? (
                <Select
                  id={`${idPrefix}-${parameter.name}`}
                  value={values[parameter.name] ?? ''}
                  onValueChange={(value) => onChange(parameter.name, value)}
                  required={parameter.required}
                  classNames={{
                    value: 'try-select-value',
                    icon: 'try-select-icon',
                  }}
                >
                  <SelectTrigger aria-describedby={hintId}>
                    <SelectValue
                      placeholder={parameter.example ?? parameter.defaultValue}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {parameter.allowedValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {parameter.allowedValueLabels?.[value]
                          ? `${value} (${parameter.allowedValueLabels[value]})`
                          : value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`${idPrefix}-${parameter.name}`}
                  aria-describedby={hintId}
                  value={values[parameter.name] ?? ''}
                  onChange={(event) =>
                    onChange(parameter.name, event.target.value)
                  }
                  placeholder={parameter.example ?? parameter.defaultValue}
                />
              )}
              <HelperText id={hintId} className="field-helper" size="sm">
                {parameter.description}
              </HelperText>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};
