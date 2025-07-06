import { injectable } from "inversify";
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserEntity } from "@domain/entity/user";
import { IUserRepository } from "@domain/ports/user.port";

@injectable()
export class UserRepository implements IUserRepository {
  private ddb: DynamoDBClient;
  private table: string;

  constructor() {
    this.ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
    if (!process.env.USERS_TABLE) {
      throw new Error("USERS_TABLE env var not defined");
    }
    this.table = process.env.USERS_TABLE;
  }

  async create(user: UserEntity): Promise<void> {
    try {
      await this.ddb.send(
        new PutItemCommand({
          TableName: this.table,
          Item: marshall(user, { convertClassInstanceToMap: true }),
          ConditionExpression: "attribute_not_exists(email)",
        })
      );
    } catch (err: any) {
      if (err.name === "ConditionalCheckFailedException") {
        throw new Error("Email ya en uso");
      }
      throw err;
    }
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const resp = await this.ddb.send(
      new QueryCommand({
        TableName: this.table,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :e",
        ExpressionAttributeValues: marshall({ ":e": email }),
        ProjectionExpression:
          "#name, user_id, email, password, phone, address, #status, #type, created_at, updated_at",
        ExpressionAttributeNames: {
          "#name": "name",
          "#status": "status",
          "#type": "type",
        },
        Limit: 1,
      })
    );
    if (!resp.Items || resp.Items.length === 0) {
      return null;
    }
    const data = unmarshall(resp.Items[0]);
    return new UserEntity(data);
  }

  async getById(user_id: string): Promise<UserEntity | null> {
    const resp = await this.ddb.send(
      new GetItemCommand({
        TableName: this.table,
        Key: marshall({ user_id }),
        ProjectionExpression:
          "#name, user_id, email, password, phone, address, #status, #type, created_at, updated_at",
        ExpressionAttributeNames: {
          "#name": "name",
          "#status": "status",
          "#type": "type",
        },
      })
    );
    if (!resp.Item) {
      return null;
    }
    return new UserEntity(unmarshall(resp.Item));
  }

  async update(user: UserEntity): Promise<void> {
    await this.ddb.send(
      new PutItemCommand({
        TableName: this.table,
        Item: marshall(user, { convertClassInstanceToMap: true }),
      })
    );
  }
}
