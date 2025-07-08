const httpStatus = require('http-status');
const { fakerZH_TW: faker } = require('@faker-js/faker');
const randomSeed = faker.number.int(); // <- random
faker.seed(randomSeed);
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { Project } = require('../models');

const generateRandomProjects = (numProjects) => {
  const fakeData = [];
  for (let i = 0; i < numProjects; i += 1) {
    const project = {};
    const currentAmount = faker.number.int({ min: 0, max: 10000000 / 2 });
    const goalAmount = faker.number.int({ min: currentAmount, max: 10000000 });
    project.projectProposer = faker.database.mongodbObjectId();
    project.projectTeam = {
      _id: faker.database.mongodbObjectId(),
      teamName: `團隊名稱_${i}`,
      teamIntroduction: faker.lorem.paragraph(),
      teamAvatar: faker.image.avatar(),
      representativeName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      representativeMobile: faker.phone.imei(),
      representativePhone: faker.phone.imei(),
      representativeEmail: faker.internet.email(),
      companyName: `公司名稱_${i}`,
      companyPhone: faker.phone.imei(),
      companyRegistrationNumber: faker.string.alpha(10),
      companyAddress: '公司地址-公司地址-公司地址',
      socialWebsite: faker.internet.url(),
      socialEmail: faker.internet.email(),
      socialFb: faker.internet.url(),
      socialLine: faker.internet.url(),
      socialIg: faker.internet.url(),
      socialYoutube: faker.internet.url(),
      isOver18: faker.datatype.boolean(0),
      isAgreeTerms: faker.datatype.boolean(0),
      isTaiwan: faker.datatype.boolean(0),
    };
    project.projectPlans = [];
    for (let j = 0; j < 3; j += 1) {
      const plan = {
        planName: faker.commerce.productName(),
        planType: faker.helpers.arrayElement(['Type A', 'Type B', 'Type C']),
        planQuantity: faker.number.int({ min: 0, max: 3 }),
        planDiscountPrice: faker.commerce.price(),
        planOriginalPrice: faker.commerce.price(),
        planStartTime: faker.date.future(),
        planEndTime: faker.date.future(),
        planImage: faker.image.urlPicsumPhotos(),
        planDescription: faker.lorem.paragraph(),
        otherNotes: [faker.lorem.sentence(), faker.lorem.sentence()],
        planBackers: faker.number.int({ min: 0, max: 100 }),
        isRealProduct: faker.datatype.boolean(),
      };
      project.projectPlans.push(plan);
    }
    project.latestNews = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.faqs = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.comments = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.projectOrders = [faker.database.mongodbObjectId()];
    project.projectRefunds = [faker.database.mongodbObjectId()];
    project.projectFollowers = [faker.database.mongodbObjectId()];
    project.projectType = faker.number.int({ min: 0, max: 1 });
    project.projectForm = faker.number.int({ min: 0, max: 3 });
    project.projectStatus = faker.number.int({ min: 0, max: 9 });
    project.projectCategory = faker.number.int({ min: 0, max: 5 });
    project.projectName = faker.commerce.productName();
    project.projectImage = faker.image.urlPicsumPhotos();
    project.projectDescription = faker.lorem.paragraph();
    project.goalAmount = goalAmount;
    project.currentAmount = currentAmount;
    project.startTime = faker.date.past();
    project.endTime = faker.date.future();
    project.officialPage = faker.internet.url();
    project.fanPage = faker.internet.url();
    project.attachmentLink = faker.internet.url();
    project.projectContent = faker.lorem.paragraph();
    project.projectScore = faker.number.int({ min: 0, max: 10 });
    project.projectBackers = faker.number.int({ min: 0, max: 10000 });
    project.projectUrl = faker.internet.url();
    project.carousel = faker.datatype.boolean();
    project.withdrawSettings = {
      isAgreeTerms: faker.datatype.boolean(),
      accountNumber: faker.finance.account(),
      bankName: faker.finance.accountName(),
    };
    project.shippingSettings = {
      shippingSwitch: faker.datatype.boolean(),
      deliveryInfo: {
        deliverySwitch: faker.datatype.boolean(),
        deliveryFee: faker.number.int({ min: 0, max: 100 }),
        multiProductCheckout: faker.number.int({ min: 0, max: 1 }),
        freeShippingConditions: faker.number.int({ min: 0, max: 1 }),
        freeShippingPrice: faker.number.int({ min: 0, max: 3000 }),
        senderName: `${faker.person.firstName()} ${faker.person.lastName()}`,
        senderPhone: faker.phone.imei(),
        senderAddress: 'senderAddress',
        senderPostalCode: 'senderPostalCode',
      },
      cvsInfo: {
        cvsSwitch: faker.datatype.boolean(),
        deliveryFee: faker.number.int({ min: 0, max: 100 }),
        multiProductCheckout: faker.number.int({ min: 0, max: 1 }),
        freeShippingConditions: faker.number.int({ min: 0, max: 1 }),
        freeShippingPrice: faker.number.int({ min: 0, max: 3000 }),
        cvsName: faker.number.int({ min: 0, max: 2 }),
      },
    };

    fakeData.push(project);
  }
  return fakeData;
};

const getProjects = async (query) => {
  // page 預設get頁數
  // perPage 預設取得資料筆數
  const { projectForm, projectCategory, sortBy, page = 1, perPage = 20 } = query;
  let totalQuery = {};
  const pipeline = [];

  // 預設排除 projectStatus 為 0，1，2 的專案
  const excludeStatuses = [0, 1, 2];
  pipeline.push({ $match: { projectStatus: { $nin: excludeStatuses } } });
  totalQuery = {
    ...totalQuery,
    projectStatus: { $nin: excludeStatuses },
  };

  // filter
  if (projectCategory >= 0) {
    pipeline.push({ $match: { projectCategory } });
    totalQuery = {
      ...totalQuery,
      projectCategory,
    };
  }
  if (projectForm >= 0) {
    pipeline.push({ $match: { projectForm } });
    totalQuery = {
      ...totalQuery,
      projectForm,
    };
  }
  // sort
  if (sortBy === 'endTime') {
    // 專案結束 排序舊 -> 新
    pipeline.push({ $sort: { endTime: 1 } });
  } else if (sortBy === 'goalAmount') {
    pipeline.push({ $sort: { goalAmount: -1 } });
  } else {
    // 專案開始 排序新 -> 舊
    pipeline.push({ $sort: { startTime: -1 } });
  }
  // pagination
  const skipCount = (page - 1) * perPage;
  pipeline.push({ $skip: skipCount });
  pipeline.push({ $limit: perPage });
  const data = await Project.aggregate(pipeline).exec();
  const populatedData = await Project.populate(data, { path: 'projectTeam', model: 'Team' });
  const total = await Project.countDocuments(totalQuery);

  return {
    data: populatedData,
    total,
  };
};

const getBackendProjects = async (query) => {
  // page 預設get頁數
  // perPage 預設取得資料筆數
  const { projectForm, projectCategory, sortBy, page = 1, perPage = 20 } = query;
  let totalQuery = {};
  const pipeline = [];

  // filter
  if (projectCategory >= 0) {
    pipeline.push({ $match: { projectCategory } });
    totalQuery = {
      ...totalQuery,
      projectCategory,
    };
  }
  if (projectForm >= 0) {
    pipeline.push({ $match: { projectForm } });
    totalQuery = {
      ...totalQuery,
      projectForm,
    };
  }
  // sort
  if (sortBy === 'endTime') {
    // 專案結束 排序舊 -> 新
    pipeline.push({ $sort: { endTime: 1 } });
  } else if (sortBy === 'goalAmount') {
    pipeline.push({ $sort: { goalAmount: -1 } });
  } else {
    // 專案開始 排序新 -> 舊
    pipeline.push({ $sort: { startTime: -1 } });
  }
  // pagination
  const skipCount = (page - 1) * perPage;
  pipeline.push({ $skip: skipCount });
  pipeline.push({ $limit: perPage });
  const data = await Project.aggregate(pipeline).exec();
  const populatedData = await Project.populate(data, { path: 'projectTeam', model: 'Team' });
  const total = await Project.countDocuments(totalQuery);

  return {
    data: populatedData,
    total,
  };
};

const getProjectById = async (projectId) => {
  // 移除get回傳__v欄位
  const data = await Project.findById(projectId);
  const populatedData = await Project.populate(data, { path: 'projectTeam', model: 'Team' });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'projectId not found');
  }
  return { status: 'Success', data: populatedData };
};

const postFakeProjects = async (query) => {
  // /api/projects/fake?count=60
  // 生成count筆亂數 projects 資料
  const { count } = query;
  const randomProjects = generateRandomProjects(count || 60);
  const result = await Project.create(randomProjects);
  return result;
};

const queryProjectsHot = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  const populatedData = await Project.populate(projects.data, {
    path: 'projectTeam',
    model: 'Team',
    options: { strictPopulate: true },
  });
  return { status: 'Success', data: populatedData };
};
const queryProjectsCarousel = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  const populatedData = await Project.populate(projects.data, {
    path: 'projectTeam',
    model: 'Team',
    options: { strictPopulate: true },
  });
  return { status: 'Success', data: populatedData };
};
const queryProjectsPicks = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  const populatedData = await Project.populate(projects.data, {
    path: 'projectTeam',
    model: 'Team',
    options: { strictPopulate: true },
  });
  return { status: 'Success', data: populatedData };
};
const queryProjectsSuccess = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  const populatedData = await Project.populate(projects.data, {
    path: 'projectTeam',
    model: 'Team',
    options: { strictPopulate: true },
  });
  return { status: 'Success', data: populatedData };
};
const queryProjectsNew = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  const populatedData = await Project.populate(projects.data, {
    path: 'projectTeam',
    model: 'Team',
    options: { strictPopulate: true },
  });
  return { status: 'Success', data: populatedData };
};

const createProject = async (userBody) => {
  const {
    projectProposer,
    projectType,
    projectName,
    projectDescription,
    projectImage,
    projectCategory,
    goalAmount,
    startTime,
    endTime,
    officialPage,
    fanPage,
    attachmentLink,
    projectContent,
    projectPlans,
    withdrawSettings,
    shippingSettings,
  } = userBody.body;
  const { projectTeam } = userBody.team;
  const projects = {
    projectProposer,
    projectType,
    projectName,
    projectDescription,
    projectTeam,
    projectImage,
    projectCategory,
    goalAmount,
    startTime,
    endTime,
    officialPage,
    fanPage,
    attachmentLink,
    projectContent,
    projectPlans,
    withdrawSettings,
    shippingSettings,
  };
  // if (await Project.isProjectNameTaken(projectName)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Project Name already taken');
  // }
  return Project.create(projects);
};

const updateProjectStatusById = async (req, res) => {
  // 從請求中取得projectId與projectStatus
  const { projectId } = req.params;
  const { projectStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'Invalid projectId.' });
  }

  if (projectStatus === undefined) {
    return res.status(400).json({ error: 'Missing projectStatus.' });
  }

  // 尋找並更新專案狀態
  const project = await Project.findByIdAndUpdate(
    projectId,
    { projectStatus },
    { new: true } // 這個選項讓mongoose返回更新後的文檔
  );

  return project;
};

module.exports = {
  getProjects,
  getBackendProjects,
  getProjectById,
  postFakeProjects,
  queryProjectsHot,
  queryProjectsCarousel,
  queryProjectsPicks,
  queryProjectsSuccess,
  queryProjectsNew,
  createProject,
  updateProjectStatusById,
};
