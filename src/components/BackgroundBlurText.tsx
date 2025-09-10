export function BackgroundBlurText({ text }: { text: string | undefined }) {
  return (
    <span className='backdrop-blur-sm bg-black/60 rounded-lg px-2 py-1 capitalize text-white text-shadow-sm text-shadow-black'>
      {text}
    </span>
  );
}
