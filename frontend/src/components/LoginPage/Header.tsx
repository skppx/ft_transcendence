export default function Header(props: { name?: string }) {
  const { name } = props;
  return (
    <h1 className="mb-2 text-center font-roboto text-[35px] font-bold text-white">
      {name !== undefined ? name : 'Pong42'}
    </h1>
  );
}
