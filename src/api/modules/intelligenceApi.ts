// 招商情报 API
import {
  getMockNewsList,
  getMockProjectList,
  getMockTechTransfers,
  getMockCapitalList,
  getMockTalentList,
  getMockQualificationChanges,
  getMockInvestEvents,
  getMockTrackList,
  getMockReportList,
} from '@/api/mock/intelligence'

export function fetchNewsList(count = 30) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockNewsList(count)), 200)
  })
}

export function fetchProjectList(count = 20) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockProjectList(count)), 200)
  })
}

export function fetchTechTransfers(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTechTransfers(count)), 200)
  })
}

export function fetchCapitalList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockCapitalList(count)), 200)
  })
}

export function fetchTalentList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTalentList(count)), 200)
  })
}

export function fetchQualificationChanges(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockQualificationChanges(count)), 200)
  })
}

export function fetchInvestEvents(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockInvestEvents(count)), 200)
  })
}

export function fetchTrackList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockTrackList(count)), 200)
  })
}

export function fetchReportList(count = 10) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockReportList(count)), 200)
  })
}
