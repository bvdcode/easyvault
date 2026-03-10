import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { VaultData } from "../types";
import { VaultApiService } from "../services";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface VaultContextType {
  vaultData: VaultData[];
  isLoading: boolean;
  hasChanges: boolean;
  password: string | null;
  setPassword: (password: string | null) => void;
  loadVaultData: (password: string) => Promise<void>;
  updateVaultData: (
    updater: VaultData[] | ((prev: VaultData[]) => VaultData[]),
  ) => void;
  saveVaultData: () => Promise<void>;
  importVaultData: (data: VaultData[]) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [vaultData, setVaultData] = useState<VaultData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [password, setPassword] = useState<string | null>(null);

  const loadVaultData = useCallback(
    async (pwd: string) => {
      try {
        setIsLoading(true);
        const data = await VaultApiService.getVaultData(pwd);
        setVaultData(data);
        setHasChanges(false);
      } catch (err) {
        toast.error(
          t("vaultList.fetchError", {
            error: err instanceof Error ? err.message : String(err),
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const updateVaultData = useCallback(
    (updater: VaultData[] | ((prev: VaultData[]) => VaultData[])) => {
      setVaultData((prev) =>
        typeof updater === "function" ? updater(prev) : updater,
      );
      setHasChanges(true);
    },
    [],
  );

  const saveVaultData = useCallback(async () => {
    if (!password) {
      toast.error("No password set");
      return;
    }

    try {
      setIsLoading(true);
      await VaultApiService.saveVaultData(password, vaultData);
      toast.success(t("vaultList.saveSuccess"));
      setHasChanges(false);
    } catch (err) {
      toast.error(
        t("vaultList.saveError", {
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [password, vaultData, t]);

  const importVaultData = useCallback((data: VaultData[]) => {
    setVaultData(data);
    setHasChanges(true);
  }, []);

  return (
    <VaultContext.Provider
      value={{
        vaultData,
        isLoading,
        hasChanges,
        password,
        setPassword,
        loadVaultData,
        updateVaultData,
        saveVaultData,
        importVaultData,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within VaultProvider");
  }
  return context;
};
