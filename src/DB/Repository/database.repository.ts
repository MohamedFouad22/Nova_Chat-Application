import {
  ApplyBasicCreateCasting,
  CreateOptions,
  DeepPartial,
  Model,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";

export abstract class DataBaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  findOne = async ({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<TDocument>;
    projection?: ProjectionType<TDocument> | null | undefined;
    options?: QueryOptions<TDocument> | null | undefined;
  }) => {
    return await this.model.findOne(filter, projection, options);
  };

  findById = async ({
    id,
    projection,
    options,
  }: {
    id?: any;
    projection?: ProjectionType<TDocument> | null | undefined;
    options?: QueryOptions<TDocument> | null;
  }) => {
    return await this.model.findById(id, projection, options);
  };

  find = async ({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<TDocument>;
    projection?: ProjectionType<TDocument> | null | undefined;
    options?: QueryOptions<TDocument>;
  }) => {
    return await this.model.find(filter, projection, options);
  };

  findOneAndUpdate = async ({
    filter,
    update,
    options,
  }: {
    filter?: QueryFilter<TDocument>;
    update?: UpdateQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
  }) => {
    return await this.model.findOneAndUpdate(filter, update, options);
  };

  updateOne = async ({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<TDocument>;
    update: UpdateQuery<TDocument> | UpdateWithAggregationPipeline;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }) => {
    return await this.model.updateOne(filter, update, options);
  };

  create = async ({
    data,
    options,
  }: {
    data: Array<DeepPartial<ApplyBasicCreateCasting<Require_id<TDocument>>>>;
    options?: CreateOptions;
  }) => {
    return await this.model.create(data, options);
  };

  findOneAndDelete = async ({
    filter,
    options,
  }: {
    filter?: QueryFilter<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }) => {
    return await this.model.findOneAndDelete(filter, options);
  };
}
