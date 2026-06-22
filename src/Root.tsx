import {Composition} from 'remotion';
import {TextMotion} from './TextMotion';
import {OpacityCurvesA} from './OpacityCurvesA';
import {EasingMotionB} from './showcases/EasingMotionB';
import {ScaleTransform3DC} from './showcases/ScaleTransform3DC';
import {BlurFilterD} from './showcases/BlurFilterD';
import {WaveTrigE} from './showcases/WaveTrigE';
import {PerCharStaggerF} from './showcases/PerCharStaggerF';
import {ClipMaskG} from './showcases/ClipMaskG';
import {NoiseRandomH} from './showcases/NoiseRandomH';
import {ParticleI} from './showcases/ParticleI';
import {ColorLightJ} from './showcases/ColorLightJ';
import {GlitchK} from './showcases/GlitchK';
import {FractalChaosL} from './showcases/FractalChaosL';
import {HeroDemo, HeroDemoFrames, CaptionDemo, CaptionDemoFrames} from './textfx/demos';
import {totalFrames} from './effects/showcaseKit';
import {
  CATEGORY_B,
  CATEGORY_C,
  CATEGORY_D,
  CATEGORY_E,
  CATEGORY_F,
  CATEGORY_G,
  CATEGORY_H,
  CATEGORY_I,
  CATEGORY_J,
  CATEGORY_K,
  CATEGORY_L,
} from './effects/categories';

const COMMON = {fps: 30, width: 1920, height: 1080} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TextMotion"
        component={TextMotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: 'Hello Motion Graphics',
        }}
      />
      <Composition id="OpacityCurvesA" component={OpacityCurvesA} durationInFrames={624} {...COMMON} />
      <Composition
        id="EasingMotionB"
        component={EasingMotionB}
        durationInFrames={totalFrames(CATEGORY_B.length)}
        {...COMMON}
      />
      <Composition
        id="ScaleTransform3DC"
        component={ScaleTransform3DC}
        durationInFrames={totalFrames(CATEGORY_C.length)}
        {...COMMON}
      />
      <Composition
        id="BlurFilterD"
        component={BlurFilterD}
        durationInFrames={totalFrames(CATEGORY_D.length)}
        {...COMMON}
      />
      <Composition
        id="WaveTrigE"
        component={WaveTrigE}
        durationInFrames={totalFrames(CATEGORY_E.length)}
        {...COMMON}
      />
      <Composition
        id="PerCharStaggerF"
        component={PerCharStaggerF}
        durationInFrames={totalFrames(CATEGORY_F.length)}
        {...COMMON}
      />
      <Composition
        id="ClipMaskG"
        component={ClipMaskG}
        durationInFrames={totalFrames(CATEGORY_G.length)}
        {...COMMON}
      />
      <Composition
        id="NoiseRandomH"
        component={NoiseRandomH}
        durationInFrames={totalFrames(CATEGORY_H.length)}
        {...COMMON}
      />
      <Composition
        id="ParticleI"
        component={ParticleI}
        durationInFrames={totalFrames(CATEGORY_I.length)}
        {...COMMON}
      />
      <Composition
        id="ColorLightJ"
        component={ColorLightJ}
        durationInFrames={totalFrames(CATEGORY_J.length)}
        {...COMMON}
      />
      <Composition
        id="GlitchK"
        component={GlitchK}
        durationInFrames={totalFrames(CATEGORY_K.length)}
        {...COMMON}
      />
      <Composition
        id="FractalChaosL"
        component={FractalChaosL}
        durationInFrames={totalFrames(CATEGORY_L.length)}
        {...COMMON}
      />
      <Composition id="SceneHero" component={HeroDemo} durationInFrames={HeroDemoFrames} {...COMMON} />
      <Composition id="SceneCaption" component={CaptionDemo} durationInFrames={CaptionDemoFrames} {...COMMON} />
    </>
  );
};
