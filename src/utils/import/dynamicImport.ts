export async function dynamicImport(modulePath: string) {
  const uniquePath = `${modulePath}?update=${Date.now()}`;
  const reloadedModule = await import(uniquePath);
  return reloadedModule;
}