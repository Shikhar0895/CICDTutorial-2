import { CustomRequest } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express";

const editProfile = async (req: CustomRequest, res: Response) => {
  const { name, avatar, email, photo } = req.body;
  const updateData = await prismaClient.users.update({
    where: {
      id: req.user?.id,
      username: req.user?.username,
    },
    data: {
      // name: data?.name ? data?.photo : null,
      // avatar:data?.photo ? data?.photo : null,
      // email:data?.photo ? data?.photo : null,
      // photo: data?.photo ? data?.photo : null
      ...(name && { name }),
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(photo && { photo }),
    },
  });
};
export { editProfile };
