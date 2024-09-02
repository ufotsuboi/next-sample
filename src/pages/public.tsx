import { createCaller } from "@/lib/trpc/server";
import type { Room } from "@/models";
import { createContextGetServerSideProps } from "@/server/context";
import { GetServerSideProps } from "next";
import Link from "next/link";

type Props = {
  rooms: Room[];
};

export default function Page({ rooms }: Props) {
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
