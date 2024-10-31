import React, { useCallback, useEffect, useState } from "react";
import {
  ColorPicker,
  hsbToHex,
  hexToRgb,
  rgbToHsb,
  InlineStack,
  BlockStack,
  TextField,
} from "@shopify/polaris";

interface ColourPickerWithHexProps {
  hex: string;
  setHex: (value: string) => void;
}

export default function ColourPickerWithHex({
  hex,
  setHex,
}: ColourPickerWithHexProps) {
  const [hsb, setHsb] = useState(hexToHsb(hex));
  const [hexField, setHexField] = useState(hex);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    setHsb(hexToHsb(hex));
    setHexField(hex);
  }, [hex]);

  const handleColorPickerChange = useCallback(
    (hsbValue) => {
      const newHex = hsbToHex(hsbValue);
      setHsb(hsbValue);
      setHex(newHex);
      setHexField(newHex);
    },
    [setHex],
  );

  const handleTextChange = useCallback(
    (hexValue) => {
      setHexField(hexValue);
      const isValidHex = /^#?([0-9A-F]{6})$/i.test(hexValue);

      if (isValidHex) {
        try {
          const newHsb = hexToHsb(hexValue);
          setHsb(newHsb);
          setHex(hexValue);
          setInputError(false);
        } catch (error) {
          setInputError(true);
        }
      } else {
        setInputError(true);
      }
    },
    [setHex],
  );

  const Swatch = ({ value }) => {
    return (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "0.25rem",
          background: value,
        }}
      />
    );
  };

  return (
    <BlockStack gap="200">
      <ColorPicker onChange={handleColorPickerChange} color={hsb} />

      <div style={{ width: "12rem" }}>
        <InlineStack gap="200" wrap={false}>
          <Swatch value={hex} />

          <TextField
            label=""
            value={hexField}
            onChange={(value) => handleTextChange(value)}
            autoComplete="off"
            error={inputError}
          />
        </InlineStack>
      </div>
    </BlockStack>
  );
}

// Helper functions to convert between color formats
function hexToHsb(hex: string) {
  const rgb = hexToRgb(hex);
  const hsb = rgbToHsb(rgb);
  return hsb;
}
