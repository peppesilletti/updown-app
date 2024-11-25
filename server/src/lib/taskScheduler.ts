type Config = {
  project: string;
  location: string;
  queue: string;
};

type ScheduleFn = (args: {
  payload: unknown;
  inSeconds: number;
  url: string;
}) => Promise<string | null | undefined>;

class TaskScheduler {
  private config: Config;
  private GoogleCloudTasks: any;

  constructor(config: Config) {
    this.config = config;
  }

  async init() {
    this.GoogleCloudTasks = await import("@google-cloud/tasks");
  }

  public schedule: ScheduleFn = async (args) => {
    const client = new this.GoogleCloudTasks.v2.CloudTasksClient();

    const parent: string = client.queuePath(
      this.config.project,
      this.config.location,
      this.config.queue
    );

    const task = {
      httpRequest: {
        headers: {
          "Content-Type": "application/json",
        },
        httpMethod:
          this.GoogleCloudTasks.protos.google.cloud.tasks.v2.HttpMethod.POST,
        url: args.url,
      },
    };

    if (args.payload) {
      // @ts-ignore
      task.httpRequest!.body = Buffer.from(
        JSON.stringify(args.payload)
      ).toString("base64");
    }

    if (args.inSeconds) {
      // @ts-ignore
      task.scheduleTime = {
        seconds: Math.floor(args.inSeconds + Date.now() / 1000),
      };
    }

    const request = {
      parent,
      task,
    };

    const [response] = await client.createTask(request);

    return response.name;
  };
}

export default TaskScheduler;
