export interface AdminInventoryRow {
  variantId: string;
  productTitle: string;
  sku: string;
  size?: string;
  color: string;
  locationName: string;
  available: number;
  reserved: number;
  reorderPoint: number;
}

const make = (
  variantId: string,
  productTitle: string,
  sku: string,
  options: { size?: string; color: string; locationName: string; available: number; reserved?: number; reorderPoint?: number },
): AdminInventoryRow => ({
  variantId,
  productTitle,
  sku,
  size: options.size,
  color: options.color,
  locationName: options.locationName,
  available: options.available,
  reserved: options.reserved ?? 0,
  reorderPoint: options.reorderPoint ?? 5,
});

export const adminInventory: readonly AdminInventoryRow[] = [
  make('var_001', 'Amber kaftan', 'NSJ-KFT-AMB-M-AMBER', { size: 'M', color: 'amber', locationName: 'Online', available: 34 }),
  make('var_002', 'Amber kaftan', 'NSJ-KFT-AMB-L-AMBER', { size: 'L', color: 'amber', locationName: 'Online', available: 28 }),
  make('var_003', 'Amber kaftan', 'NSJ-KFT-AMB-M-AMBER', { size: 'M', color: 'amber', locationName: 'Cairo Flagship', available: 12, reserved: 2 }),
  make('var_004', 'Wide-leg linen trousers', 'NSJ-TRS-LIN-M-STONE', { size: 'M', color: 'stone', locationName: 'Online', available: 4, reorderPoint: 5 }),
  make('var_005', 'Wide-leg linen trousers', 'NSJ-TRS-LIN-L-TERRACOTTA', { size: 'L', color: 'terracotta', locationName: 'Online', available: 18 }),
  make('var_006', 'Oversized poplin shirt', 'NSJ-SHR-OVR-S-SAGE', { size: 'S', color: 'sage', locationName: 'Cairo Flagship', available: 2, reorderPoint: 5 }),
  make('var_007', 'Long wool coat', 'NSJ-COA-WOL-M-STONE', { size: 'M', color: 'stone', locationName: 'Online', available: 7 }),
  make('var_008', 'Long wool coat', 'NSJ-COA-WOL-L-STONE', { size: 'L', color: 'stone', locationName: 'Cairo Flagship', available: 3, reorderPoint: 5 }),
  make("var_009", "Men's overshirt", 'NSJ-OVS-MEN-L-SAGE', { size: 'L', color: 'sage', locationName: 'Online', available: 22 }),
  make("var_010", "Men's chino trousers", 'NSJ-CHN-MEN-XL-STONE', { size: 'XL', color: 'stone', locationName: 'Online', available: 14 }),
  make("var_011", "Men's heavyweight tee", 'NSJ-TEE-MEN-M-AMBER', { size: 'M', color: 'amber', locationName: 'Online', available: 41 }),
  make('var_012', 'Silk scarf', 'NSJ-ACC-SLK-ONE-SIZE-STONE', { color: 'stone', locationName: 'Online', available: 16 }),
  make('var_013', 'Vegetable-tanned leather belt', 'NSJ-ACC-BLT-M-AMBER', { size: 'M', color: 'amber', locationName: 'Cairo Flagship', available: 9 }),
  make('var_014', 'Canvas tote bag', 'NSJ-ACC-TOT-ONE-SIZE-SAGE', { color: 'sage', locationName: 'Online', available: 0, reorderPoint: 5 }),
  make('var_015', 'Washed cotton cap', 'NSJ-ACC-CAP-ONE-SIZE-TERRACOTTA', { color: 'terracotta', locationName: 'Online', available: 23 }),
];
