import { Composition } from "remotion";
import { Promo, DURATION } from "./Promo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Promo-Landscape" component={Promo} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
    <Composition id="Promo-Portrait" component={Promo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
  </>
);
