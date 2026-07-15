/* Static neon-SUV hero backdrop, fixed behind the page. Replaces the WebGL
   NeonJourney with the approved neon SUV artwork (public/hero/suv-neon.jpg). */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: "url(/hero/suv-neon.jpg)" }}
    />
  );
}
