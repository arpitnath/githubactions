import React from 'react';
import { resolveReferences, resolveWidgetFieldValue } from '@/_helpers/utils';

export const RadioButton = function RadioButton({
  id,
  width,
  height,
  component,
  onComponentClick,
  currentState,
  onComponentOptionChanged,
  onEvent,
}) {
  const label = component.definition.properties.label.value;
  const textColorProperty = component.definition.styles.textColor;
  const textColor = textColorProperty ? textColorProperty.value : '#000';

  const defaultValue = component.definition.properties.value.value;
  const values = component.definition.properties.values.value;
  const displayValues = component.definition.properties.display_values.value;
  const widgetVisibility = component.definition.styles?.visibility?.value ?? true;
  const disabledState = component.definition.styles?.disabledState?.value ?? false;

  const parsedDisabledState =
    typeof disabledState !== 'boolean' ? resolveWidgetFieldValue(disabledState, currentState) : disabledState;

  let parsedValues = values;

  try {
    parsedValues = resolveReferences(values, currentState, []);
  } catch (err) {
    console.log(err);
  }

  let parsedDisplayValues = displayValues;

  try {
    parsedDisplayValues = resolveReferences(displayValues, currentState, []);
  } catch (err) {
    console.log(err);
  }

  let parsedDefaultValue = defaultValue;

  try {
    parsedDefaultValue = resolveReferences(defaultValue, currentState, []);
  } catch (err) {
    console.log(err);
  }

  let selectOptions = [];

  try {
    selectOptions = [
      ...parsedValues.map((value, index) => {
        return { name: parsedDisplayValues[index], value: value };
      }),
    ];
  } catch (err) {
    console.log(err);
  }

  let parsedWidgetVisibility = widgetVisibility;

  try {
    parsedWidgetVisibility = resolveReferences(parsedWidgetVisibility, currentState, []);
  } catch (err) {
    console.log(err);
  }

  function onSelect(event) {
    const selection = event.target.value;
    onComponentOptionChanged(component, 'value', selection);
    if (selection) {
      onEvent('onSelectionChange', { component });
    }
  }

  return (
    <div
      data-disabled={parsedDisabledState}
      className="row"
      style={{ width, height, display: parsedWidgetVisibility ? '' : 'none' }}
      onClick={(event) => {
        event.stopPropagation();
        onComponentClick(id, component);
      }}
    >
      <span className="form-check-label form-check-label col-auto py-1" style={{ color: textColor }}>
        {label}
      </span>
      <div className="col py-1" onChange={(e) => onSelect(e)}>
        {selectOptions.map((option, index) => (
          <label key={index} className="form-check form-check-inline">
            <input
              className="form-check-input"
              defaultChecked={parsedDefaultValue === option.value}
              type="radio"
              value={option.value}
              name="radio-options"
            />
            <span className="form-check-label" style={{ color: textColor }}>
              {option.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
