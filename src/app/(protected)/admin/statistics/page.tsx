'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import IssueStatistics from '@/components/issues/issue-statistics';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/slices/ui-slice';
import { IssueCategory } from '@/types/issue';

// Mock data for statistics
const mockStatData = {
  totalIssues: 357,
  resolvedIssues: 248,
  pendingIssues: 82,
  rejectedIssues: 27,
  averageResolutionTime: '5.3 days',
  categoryDistribution: [
    { category: 'roads', count: 128, percentage: 35.9 },
    { category: 'energy-supply', count: 52, percentage: 14.6 },
    { category: 'water-supply', count: 42, percentage: 11.8 },
    { category: 'network', count: 18, percentage: 5.0 },
    { category: 'public-transport', count: 48, percentage: 13.4 },
    { category: 'ecology', count: 31, percentage: 8.7 },
    { category: 'safety', count: 26, percentage: 7.3 },
    { category: 'csc', count: 12, percentage: 3.3 },
  ],
  monthlyTrends: [
    { month: 'Jan', issues: 25, resolved: 18 },
    { month: 'Feb', issues: 32, resolved: 24 },
    { month: 'Mar', issues: 41, resolved: 35 },
    { month: 'Apr', issues: 38, resolved: 30 },
    { month: 'May', issues: 45, resolved: 35 },
    { month: 'Jun', issues: 32, resolved: 28 },
    { month: 'Jul', issues: 28, resolved: 24 },
    { month: 'Aug', issues: 35, resolved: 30 },
    { month: 'Sep', issues: 42, resolved: 36 },
    { month: 'Oct', issues: 39, resolved: 29 },
    { month: 'Nov', issues: 0, resolved: 0 },
    { month: 'Dec', issues: 0, resolved: 0 },
  ],
  issuesByRegion: [
    { region: 'Downtown', count: 105, resolved: 82 },
    { region: 'North District', count: 76, resolved: 52 },
    { region: 'South District', count: 62, resolved: 43 },
    { region: 'East District', count: 58, resolved: 36 },
    { region: 'West District', count: 56, resolved: 35 },
  ],
  topReporters: [
    { id: 'user1', name: 'Alex Johnson', issuesReported: 24, resolved: 18 },
    { id: 'user2', name: 'Sarah Williams', issuesReported: 19, resolved: 15 },
    { id: 'user3', name: 'Michael Brown', issuesReported: 17, resolved: 12 },
    { id: 'user4', name: 'Emily Davis', issuesReported: 15, resolved: 10 },
    { id: 'user5', name: 'Daniel Wilson', issuesReported: 14, resolved: 12 },
  ],
};

export default function AdminStatisticsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
      dispatch(showToast({ 
        message: 'You do not have permission to access this page', 
        type: 'error' 
      }));
    }
  }, [session, router, dispatch]);

  const handleExportData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      dispatch(showToast({ 
        message: 'Statistics exported successfully', 
        type: 'success' 
      }));
    }, 1500);
  };

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  const resolutionRate = ((mockStatData.resolvedIssues / mockStatData.totalIssues) * 100).toFixed(1);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Statistics & Analytics</h1>
          <p className="text-gray-600">View and analyze city issue data</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Button 
            variant="outline" 
            onClick={handleExportData}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? 'Exporting...' : (
              <>
                <FaCalendarAlt className="mr-2" />
                Export Data
              </>
            )}
          </Button>
          <Tabs defaultValue="month" className="w-auto">
            <TabsList>
              <TabsTrigger value="week" onClick={() => setTimeFrame('week')}>Week</TabsTrigger>
              <TabsTrigger value="month" onClick={() => setTimeFrame('month')}>Month</TabsTrigger>
              <TabsTrigger value="year" onClick={() => setTimeFrame('year')}>Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaChartLine className="mr-2 text-ainala-blue text-xl" />
              <div className="text-3xl font-bold">{mockStatData.totalIssues}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaCheckCircle className="mr-2 text-green-500 text-xl" />
              <div className="text-3xl font-bold text-green-600">{mockStatData.resolvedIssues}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Resolution Rate: {resolutionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaHourglassHalf className="mr-2 text-amber-500 text-xl" />
              <div className="text-3xl font-bold text-amber-600">{mockStatData.pendingIssues}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Avg. Time: {mockStatData.averageResolutionTime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rejected Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaTimesCircle className="mr-2 text-red-500 text-xl" />
              <div className="text-3xl font-bold text-red-600">{mockStatData.rejectedIssues}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((mockStatData.rejectedIssues / mockStatData.totalIssues) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <IssueStatistics 
              type="line" 
              data={mockStatData.monthlyTrends} 
              xKey="month" 
              series={[
                { key: 'issues', name: 'Reported', color: '#1976d2' },
                { key: 'resolved', name: 'Resolved', color: '#4CAF50' }
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <IssueStatistics 
              type="pie" 
              data={mockStatData.categoryDistribution} 
              nameKey="category" 
              valueKey="count" 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <IssueStatistics 
              type="bar" 
              data={mockStatData.issuesByRegion} 
              xKey="region" 
              series={[
                { key: 'count', name: 'Reported', color: '#1976d2' },
                { key: 'resolved', name: 'Resolved', color: '#4CAF50' }
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Reporters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500">Issues Reported</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500">Resolved</th>
                    <th className="py-3 text-right text-sm font-medium text-gray-500">Resolution %</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStatData.topReporters.map((reporter) => (
                    <tr key={reporter.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">{reporter.name}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{reporter.issuesReported}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{reporter.resolved}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">
                        {((reporter.resolved / reporter.issuesReported) * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-amber-800">Water Supply Issues in East District</h4>
                  <p className="text-amber-700 text-sm mt-1">
                    There has been a 35% increase in water supply issues in the East District over the past month.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-red-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-red-800">Street Lighting in North District</h4>
                  <p className="text-red-700 text-sm mt-1">
                    12 street lighting issues have been reported in the same area of North District, requiring urgent attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}