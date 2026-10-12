export default function getInitials(name: string) {

  const initials = name

    .trim()

    .split(/\s+/)

    .map((part) => part.charAt(0).toUpperCase())

    .join("")

    .slice(0, 2);



  return initials || "FA";

}