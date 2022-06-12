export const getRoutes = (): string[] => {
  const allRoutes: any = (
    document.querySelector('nav.main-navigation') as any
  ).querySelectorAll('a');
  const allPages: string[] = Array.from(allRoutes).map((route: any) =>
    route.href
      .replace(window.location.origin, '')
      .replace('/', '')
      .replace('us', '')
      .trim()
  );
  return allPages;
};
