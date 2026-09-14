export const HOME_SCENES = [
  "collection",
  "compare",
  "book-visit",
  "showroom",
] as const;
export type HomeScene = (typeof HOME_SCENES)[number];

export function sceneFromHash(hash: string): HomeScene {
  const value = hash.replace(/^#/, "");
  return HOME_SCENES.find((scene) => scene === value) ?? "collection";
}

export function adjacentScene(
  scene: HomeScene,
  direction: number,
  mobile: boolean,
): HomeScene {
  const last = mobile ? 3 : 2;
  const index =
    !mobile && scene === "showroom" ? 0 : HOME_SCENES.indexOf(scene);
  return HOME_SCENES[Math.max(0, Math.min(last, index + direction))];
}
