export async function loader() {
  return Response.json({ ok: true });
}

export default function Health() {
  return null;
}
