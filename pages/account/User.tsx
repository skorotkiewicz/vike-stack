import React, { useEffect, useState } from "react";
import { onGetUser } from "./User.telefunc";

const User = ({ id }: { id: string }) => {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    onGetUser({ id }).then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default User;
