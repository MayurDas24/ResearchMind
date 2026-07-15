interface Props {
  className?: string;
}

const Skeleton = ({ className = "" }: Props) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%] ${className}`}
      style={{ animation: "shimmer 1.8s infinite linear, pulse 1.8s infinite" }}
    />
  );
};

export default Skeleton;