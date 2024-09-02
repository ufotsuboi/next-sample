import { createCaller } from "@/lib/trpc/server";
import { createContextGetServerSideProps } from "@/server/context";
import { GetServerSideProps } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const h = headers();
  h.set("x-foo", "bar");
  const c = cookies();
  const context = await createContextGetServerSideProps(ctx);
  const api = createCaller(context);
  const rooms = await api.room.getRooms();

  return (
    <div>
      <h1>Rooms</h1>
      <Link className="btn" href="/rooms/new">
        New Room
      </Link>
      <ul className="list-disc">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link className="link" href={`/rooms/${room.id}`}>
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const context = await createContextGetServerSideProps(ctx);
  const api = createCaller(context);
  const rooms = await api.room.getRooms();
  return {
    props: { rooms },
  };
};
