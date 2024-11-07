import type { User } from "@prisma/client";
import type { Room } from "@prisma/client";
import type { Message } from "@prisma/client";
import type { Prisma, PrismaClient } from "@prisma/client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, destructure } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

type TraitName = string | symbol;

type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: [{
                name: "Message",
                type: "Message",
                relationName: "MessageToUser"
            }]
    }, {
        name: "Room",
        fields: [{
                name: "Message",
                type: "Message",
                relationName: "MessageToRoom"
            }]
    }, {
        name: "Message",
        fields: [{
                name: "user",
                type: "User",
                relationName: "MessageToUser"
            }, {
                name: "Room",
                type: "Room",
                relationName: "MessageToRoom"
            }]
    }];

type UserScalarOrEnumFields = {
    name: string;
};

type UserFactoryDefineInput = {
    name?: string;
    Message?: Prisma.MessageCreateNestedManyWithoutUserInput;
};

type UserTransientFields = Record<string, unknown> & Partial<Record<keyof UserFactoryDefineInput, never>>;

type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, UserTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.UserCreateInput;
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "User" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, UserTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, UserTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export const defineUserFactory = (<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> => {
    return defineUserFactoryInternal(options ?? {}, {});
}) as UserFactoryBuilder;

defineUserFactory.withTransientFields = defaultTransientFieldValues => options => defineUserFactoryInternal(options ?? {}, defaultTransientFieldValues);

type RoomScalarOrEnumFields = {
    name: string;
};

type RoomFactoryDefineInput = {
    name?: string;
    Message?: Prisma.MessageCreateNestedManyWithoutRoomInput;
};

type RoomTransientFields = Record<string, unknown> & Partial<Record<keyof RoomFactoryDefineInput, never>>;

type RoomFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<RoomFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Room, Prisma.RoomCreateInput, TTransients>;

type RoomFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<RoomFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: RoomFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Room, Prisma.RoomCreateInput, TTransients>;

type RoomTraitKeys<TOptions extends RoomFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface RoomFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Room";
    build(inputData?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Prisma.RoomCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Prisma.RoomCreateInput>;
    buildList(list: readonly Partial<Prisma.RoomCreateInput & TTransients>[]): PromiseLike<Prisma.RoomCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Prisma.RoomCreateInput[]>;
    pickForConnect(inputData: Room): Pick<Room, "id">;
    create(inputData?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Room>;
    createList(list: readonly Partial<Prisma.RoomCreateInput & TTransients>[]): PromiseLike<Room[]>;
    createList(count: number, item?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Room[]>;
    createForConnect(inputData?: Partial<Prisma.RoomCreateInput & TTransients>): PromiseLike<Pick<Room, "id">>;
}

export interface RoomFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends RoomFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): RoomFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateRoomScalarsOrEnums({ seq }: {
    readonly seq: number;
}): RoomScalarOrEnumFields {
    return {
        name: getScalarFieldValueGenerator().String({ modelName: "Room", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineRoomFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends RoomFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): RoomFactoryInterface<TTransients, RoomTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly RoomTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Room", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.RoomCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateRoomScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<RoomFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<RoomFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.RoomCreateInput;
            const data: Prisma.RoomCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.RoomCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: Room) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.RoomCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().room.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.RoomCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.RoomCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Room" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: RoomTraitKeys<TOptions>, ...names: readonly RoomTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface RoomFactoryBuilder {
    <TOptions extends RoomFactoryDefineOptions>(options?: TOptions): RoomFactoryInterface<{}, RoomTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends RoomTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends RoomFactoryDefineOptions<TTransients>>(options?: TOptions) => RoomFactoryInterface<TTransients, RoomTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link Room} model.
 *
 * @param options
 * @returns factory {@link RoomFactoryInterface}
 */
export const defineRoomFactory = (<TOptions extends RoomFactoryDefineOptions>(options?: TOptions): RoomFactoryInterface<TOptions> => {
    return defineRoomFactoryInternal(options ?? {}, {});
}) as RoomFactoryBuilder;

defineRoomFactory.withTransientFields = defaultTransientFieldValues => options => defineRoomFactoryInternal(options ?? {}, defaultTransientFieldValues);

type MessageScalarOrEnumFields = {
    content: string;
};

type MessageuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutMessageInput["create"]>;
};

type MessageRoomFactory = {
    _factoryFor: "Room";
    build: () => PromiseLike<Prisma.RoomCreateNestedOneWithoutMessageInput["create"]>;
};

type MessageFactoryDefineInput = {
    content?: string;
    user: MessageuserFactory | Prisma.UserCreateNestedOneWithoutMessageInput;
    Room: MessageRoomFactory | Prisma.RoomCreateNestedOneWithoutMessageInput;
};

type MessageTransientFields = Record<string, unknown> & Partial<Record<keyof MessageFactoryDefineInput, never>>;

type MessageFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<MessageFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Message, Prisma.MessageCreateInput, TTransients>;

type MessageFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<MessageFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: MessageFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Message, Prisma.MessageCreateInput, TTransients>;

function isMessageuserFactory(x: MessageuserFactory | Prisma.UserCreateNestedOneWithoutMessageInput | undefined): x is MessageuserFactory {
    return (x as any)?._factoryFor === "User";
}

function isMessageRoomFactory(x: MessageRoomFactory | Prisma.RoomCreateNestedOneWithoutMessageInput | undefined): x is MessageRoomFactory {
    return (x as any)?._factoryFor === "Room";
}

type MessageTraitKeys<TOptions extends MessageFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface MessageFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Message";
    build(inputData?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Prisma.MessageCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Prisma.MessageCreateInput>;
    buildList(list: readonly Partial<Prisma.MessageCreateInput & TTransients>[]): PromiseLike<Prisma.MessageCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Prisma.MessageCreateInput[]>;
    pickForConnect(inputData: Message): Pick<Message, "id">;
    create(inputData?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Message>;
    createList(list: readonly Partial<Prisma.MessageCreateInput & TTransients>[]): PromiseLike<Message[]>;
    createList(count: number, item?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Message[]>;
    createForConnect(inputData?: Partial<Prisma.MessageCreateInput & TTransients>): PromiseLike<Pick<Message, "id">>;
}

export interface MessageFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends MessageFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): MessageFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateMessageScalarsOrEnums({ seq }: {
    readonly seq: number;
}): MessageScalarOrEnumFields {
    return {
        content: getScalarFieldValueGenerator().String({ modelName: "Message", fieldName: "content", isId: false, isUnique: false, seq })
    };
}

function defineMessageFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends MessageFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): MessageFactoryInterface<TTransients, MessageTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly MessageTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Message", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.MessageCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateMessageScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<MessageFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver);
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<MessageFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                user: isMessageuserFactory(defaultData.user) ? {
                    create: await defaultData.user.build()
                } : defaultData.user,
                Room: isMessageRoomFactory(defaultData.Room) ? {
                    create: await defaultData.Room.build()
                } : defaultData.Room
            } as Prisma.MessageCreateInput;
            const data: Prisma.MessageCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.MessageCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: Message) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.MessageCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().message.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.MessageCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.MessageCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Message" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: MessageTraitKeys<TOptions>, ...names: readonly MessageTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface MessageFactoryBuilder {
    <TOptions extends MessageFactoryDefineOptions>(options: TOptions): MessageFactoryInterface<{}, MessageTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends MessageTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends MessageFactoryDefineOptions<TTransients>>(options: TOptions) => MessageFactoryInterface<TTransients, MessageTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link Message} model.
 *
 * @param options
 * @returns factory {@link MessageFactoryInterface}
 */
export const defineMessageFactory = (<TOptions extends MessageFactoryDefineOptions>(options: TOptions): MessageFactoryInterface<TOptions> => {
    return defineMessageFactoryInternal(options, {});
}) as MessageFactoryBuilder;

defineMessageFactory.withTransientFields = defaultTransientFieldValues => options => defineMessageFactoryInternal(options, defaultTransientFieldValues);
