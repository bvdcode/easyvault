import { Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface AllowedValuesEditorProps {
  inputValue: string;
  label: string;
  placeholder: string;
  values: string[];
  icon?: ReactElement;
  onInputChange: (value: string) => void;
  onValuesChange: (values: string[]) => void;
}

const AllowedValuesEditor = ({
  inputValue,
  label,
  placeholder,
  values,
  icon,
  onInputChange,
  onValuesChange,
}: AllowedValuesEditorProps) => {
  const { t } = useTranslation();

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || values.includes(trimmedValue)) {
      return;
    }

    onValuesChange([...values, trimmedValue]);
    onInputChange("");
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: "medium" }}
      >
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            variant="outlined"
            icon={icon}
            onDelete={() =>
              onValuesChange(values.filter((candidate) => candidate !== value))
            }
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 9 }}>
          <TextField
            fullWidth
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={placeholder}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            startIcon={<AddIcon />}
          >
            {t("common.add")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllowedValuesEditor;
