type TIconProps = {
  svg: any;
};

export default function Icon({
  svg
}: TIconProps) {
  return <img src={svg} />
};
