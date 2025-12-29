declare module "vanta/dist/vanta.net.min.js" {
  const VANTA: {
    NET: (options: {
      el: HTMLElement;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      color?: number;
      backgroundColor?: number;
      points?: number;
      maxDistance?: number;
      spacing?: number;
    }) => {
      destroy: () => void;
    };
  };
  export default VANTA;
}
