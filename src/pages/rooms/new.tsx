import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
});
type Schema = z.output<typeof schema>;

export default function Page() {
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const createRoom = trpc.room.createRoom.useMutation().mutateAsync;
  const onSubmit = useCallback(
    async (data: Schema) => {
      await createRoom(data);
      router.push("/rooms");
    },
    [createRoom, router],
  );

  return (
    <div>
      <h1>New Room</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="form-control">
          <span className="label">Name</span>
          <input className="input input-bordered" {...register("name")} />
        </label>
        <button className="btn" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
