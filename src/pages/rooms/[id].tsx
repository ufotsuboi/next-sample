import { createCaller } from "@/lib/trpc/server";
import { Room } from "@/models";
import { createContextGetServerSideProps } from "@/server/context";
import { GetServerSideProps } from "next";
import * as z from "zod";

type Props = {
  room: Room;
};

export default function Page({ room }: Props) {
  return (
    <div>
      <h1>Room {room.name}</h1>
    </div>
  );
}

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const r = paramsSchema.safeParse(ctx.params);
  if (!r.success) {
    return {
      notFound: true,
    };
  }
  const context = await createContextGetServerSideProps(ctx);
  const api = createCaller(context);
  const room = await api.room.getRoom({ id: r.data.id });
  if (!room) {
    return {
      notFound: true,
    };
  }
  return {
    props: { room },
  };
};
