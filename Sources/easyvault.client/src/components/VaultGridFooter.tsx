import { Add, Save } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { GridFooterContainer, GridPagination } from "@mui/x-data-grid";
import { t } from "i18next";

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    hasChanges: boolean;
    hasEntries: boolean;
    onAdd: () => void;
    onSave: () => void;
  }
}

interface VaultGridFooterProps {
  hasChanges: boolean;
  hasEntries: boolean;
  onAdd: () => void;
  onSave: () => void;
}

const VaultGridFooter = ({
  hasChanges,
  hasEntries,
  onAdd,
  onSave,
}: VaultGridFooterProps) => (
  <GridFooterContainer>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1 }}>
      {hasEntries && (
        <IconButton
          aria-label={
            hasChanges ? t("vaultList.saveEntries") : t("vaultList.noChanges")
          }
          title={
            hasChanges ? t("vaultList.saveEntries") : t("vaultList.noChanges")
          }
          onClick={onSave}
          disabled={!hasChanges}
        >
          <Save color={hasChanges ? "primary" : "disabled"} />
        </IconButton>
      )}
      <IconButton
        aria-label={t("vaultList.addNewEntry")}
        title={t("vaultList.addNewEntry")}
        onClick={onAdd}
      >
        <Add color="primary" />
      </IconButton>
    </Box>
    <GridPagination />
  </GridFooterContainer>
);

export default VaultGridFooter;
