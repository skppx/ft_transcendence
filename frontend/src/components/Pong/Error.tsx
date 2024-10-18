import RenderIf from '../chat/RenderIf/RenderIf';

interface ErrorProps {
  isErr: boolean;
  errorMsg: string;
}

export function Error({ isErr, errorMsg }: ErrorProps) {
  return (
    <RenderIf some={[isErr]}>
      <div className="flex flex-grow-0 flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-2">
        <p className="whitespace-nowrap break-keep pt-[1.5px] font-roboto text-[18px] font-bold text-red-500">
          {errorMsg}
        </p>
      </div>
    </RenderIf>
  );
}
