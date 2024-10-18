import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Form, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import InputField from '@login/InputField';
import { useEffect, useState } from 'react';
import { isError } from '../../utils/functions/isError';

interface ModifyProfileProps {
  option: boolean;
  username: string;
  setOption: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setImagePreview: (prev: string) => void;
}

export default function ModifyProfile({
  option,
  username,
  setOption,
  handleClickClose,
  setImagePreview
}: ModifyProfileProps) {
  const [hasError, setHasError] = useState<string | null>(null);
  const error = useRouteError();

  useEffect(() => {
    if (error && isRouteErrorResponse(error)) {
      setHasError(error.data.message);
      setTimeout(() => {
        setHasError(null);
      }, 5000);
    } else if (error && isError(error)) {
      setHasError(error.message);
      setTimeout(() => {
        setHasError(null);
      }, 5000);
    }
  }, [error]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1000000) {
        setHasError('Invalid size of image should be under 1MB.');
        setTimeout(() => {
          setHasError(null);
        }, 5000);
        e.target.value = '';
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setHasError('Invalid file type.');
        setTimeout(() => {
          setHasError(null);
        }, 5000);
        e.target.value = '';
        return;
      }

      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = () => {
    setOption(false);
  };

  return (
    <div
      className={`slide-in-from-top absolute top-56 z-10 flex flex-col rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-6 ${
        option ? 'visible' : 'fade-out pointer-events-none'
      }`}
    >
      <div className="grid grid-cols-10">
        <button
          type="button"
          onClick={handleClickClose}
          className="col-start-10 grid items-end justify-end pt-[0.25rem] text-right"
        >
          <AiOutlineCloseCircle className="mb-[-4px] mt-3 text-2xl font-bold text-pong-blue-500" />
        </button>
      </div>
      {hasError && (
        <div className="flex items-center justify-center rounded-[18px] border border-blue-pong-1 bg-blue-pong-3 py-4 shadow-none">
          <p className="font-roboto text-sm font-bold text-red-500">
            {hasError}
          </p>
        </div>
      )}
      <Form
        method="post"
        encType="multipart/form-data"
        className="pb-4 pt-1"
        onSubmit={handleSubmit}
      >
        <InputField
          readOnly={!option}
          type="username"
          label="Username"
          placeholder={username}
          name="username"
        />
        <InputField
          readOnly={!option}
          type="password"
          label="Password"
          name="password"
        />
        <InputField
          readOnly={!option}
          type="password"
          label="Confirm Password"
          name="confirm"
        />
        <input name="hiddenInput" readOnly hidden value={username} />
        <div className="p-[1px]">
          <label
            className="font-roboto text-[15px] text-sm font-bold text-blue-pong-1"
            htmlFor="pp"
          >
            Profile Pictures
            <br />
            <input
              disabled={!option}
              className="text-sm text-white"
              type="file"
              name="pp"
              id="pp"
              onChange={handleUpload}
              multiple
            />
          </label>
          <button
            className="custom-button custom-button-hover mt-7 h-[40px] w-full rounded-[15px] border border-blue-pong-1 bg-blue-pong-4 p-1 font-roboto text-[14px] font-bold text-white hover:border-white"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
