import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { getItemDefinition } from "../../game/data/items/catalog";

function formatMoney(value: number): string {
  return `$${value}`;
}

export function InventoryPanel() {
  const {
    wallet,
    inventory,
    closePanel,
    canUseItem,
    useInventoryItem: applyInventoryItem,
    getItemUsePreview,
  } = useGameStore();
  const [useMessage, setUseMessage] = useState<string | null>(null);

  const totalItemCount = useMemo(
    () => inventory.reduce((sum, entry) => sum + entry.quantity, 0),
    [inventory]
  );

  return (
    <>
      <div className="modal-header">
        <h1>Inventory</h1>
        <p>Press I to close</p>
      </div>

      <div className="modal-body">
        <p style={{ marginBottom: "8px" }}>
          <strong>Wallet:</strong> {formatMoney(wallet)}
        </p>
        <p style={{ marginBottom: "16px", color: "var(--color-text-secondary)" }}>
          <strong>Total Items:</strong> {totalItemCount}
        </p>

        {inventory.length === 0 && (
          <p style={{ color: "var(--color-text-secondary)" }}>
            Your inventory is empty.
          </p>
        )}

        {inventory.map((entry) => {
          const item = getItemDefinition(entry.itemId);
          const unitPrice = item?.price ?? entry.unitPrice;
          const itemName = item?.name ?? entry.itemName;
          const subtotal = unitPrice * entry.quantity;
          const itemCanUse = canUseItem(entry.itemId);
          const usePreview = getItemUsePreview(entry.itemId);

          return (
            <div
              key={`${entry.itemId}-${entry.itemName}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{itemName}</strong>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {entry.category}
                </div>
                {itemCanUse && usePreview && (
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    {usePreview}
                  </div>
                )}
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "4px",
                }}
              >
                <div>x{entry.quantity}</div>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  {formatMoney(subtotal)}
                </div>
                {itemCanUse && (
                  <button
                    className="btn btn-small"
                    disabled={entry.quantity <= 0}
                    onClick={() => {
                      const result = applyInventoryItem(entry.itemId);
                      setUseMessage(result.message);
                    }}
                  >
                    Use
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {useMessage && (
          <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {useMessage}
          </p>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={closePanel}>
          Close
        </button>
      </div>
    </>
  );
}
