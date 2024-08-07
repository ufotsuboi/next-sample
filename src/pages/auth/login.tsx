import { signIn } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ message: "メールアドレスを入力してください" })
    .email({ message: "メールアドレスの形式が正しくありません" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});
type Schema = z.output<typeof schema>;

export default function Page() {
  const { register, handleSubmit, formState, setError } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signIn(email, password);
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          // 必要なエラーハンドリング
          case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
            setError("root.credential", {
              message: "メールアドレスか、パスワードが間違っています。",
            });
            return;
          case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            setError("root.credential", {
              message:
                "ログイン試行回数が多すぎます。後でもう一度お試しください。",
            });
            return;
        }
      }
      throw e;
    }
  });

  return (
    <div>
      <h1>ログイン</h1>
      {formState.errors.root?.message && (
        <span className="text-red-500">{formState.errors.root?.message}</span>
      )}
      <form onSubmit={onSubmit}>
        <label className="form-control">
          <span className="label">Email</span>
          {formState.errors.email?.message && (
            <span className="text-red-500">
              {formState.errors.email?.message}
            </span>
          )}
          <input
            type="email"
            className="input input-bordered"
            {...register("email")}
          />
        </label>
        <label className="form-control">
          <span className="label">Password</span>
          {formState.errors.password?.message && (
            <span className="text-red-500">
              {formState.errors.password?.message}
            </span>
          )}
          <input
            type="password"
            className="input input-bordered"
            {...register("password")}
          />
        </label>
        <button type="submit" className="btn">
          ログイン
        </button>
      </form>
    </div>
  );
}
