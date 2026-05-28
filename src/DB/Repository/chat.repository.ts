import { Model, PopulateOptions, QueryFilter, QueryOptions } from "mongoose";
import { IChat } from "../Models/chat.model";
import { DataBaseRepository } from "./database.repository";
import { ProjectionType } from "mongoose";

export class ChatRepository extends DataBaseRepository<IChat> {
  constructor(protected override readonly model: Model<IChat>) {
    super(model);
  }

  async findOneChat({
    filter,
    select,
    options,
    page = 1,
    size = 5,
  }: {
    filter?: QueryFilter<IChat>;
    select?: ProjectionType<IChat> | null | undefined;
    options?: QueryOptions<IChat> | null | undefined;
    page?: number | undefined;
    size?: number | undefined;
  }) {
    page = Math.floor(!page || page < 1 ? (page = 1) : page);
    size = Math.floor(!size || size < 5 ? (size = 5) : size);

    const doc = this.model.findOne(filter).select({
      message: { $slice: [-(page * size), size] },
    });

    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }

    if (options?.lean) {
      doc.lean(options.lean);
    }

    return await doc.exec();
  }
}
