import styles from "@/components/icons/RecordButton.module.css";

type PropType = {
  onClick: () => void;
  color_stroke: string;
  title: string;
};
export default function RecordingButton(props: PropType) {
  const { onClick, title, color_stroke } = props;

  return (
    <svg
      onClick={onClick}
      className={styles.icon}
      height="100%"
      version="1.1"
      viewBox="0 0 64 64"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g className={styles.outerring}>
        <path
          d="M2 32C2 15.4317 15.4317 2 32 2C48.5683 2 62 15.4317 62 32C62 48.5683 48.5683 62 32 62C15.4317 62 2 48.5683 2 32Z"
          fill="none"
          opacity="1"
          stroke={color_stroke}
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M32 2L32 32"
          fill="currentColor"
          fillRule="nonzero"
          opacity="1"
          stroke="currentColor"
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </g>

      <path
        d="M21 21L43 21L43 43L21 43L21 21Z"
        fill="currentColor"
        fillRule="nonzero"
        opacity="1"
        stroke="currentColor"
        strokeLinecap="butt"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
