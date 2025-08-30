
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Mock security audit function

interface SecurityStatus {
  score: number;
  checks: Record<string, boolean>;
  recommendations: string[];
  lastChecked: Date;
}

const SecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Run security audit on component mount
    runSecurityAudit();
    
    // Set up periodic monitoring every 5 minutes
    const interval = setInterval(runSecurityAudit, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const runSecurityAudit = async () => {
    setIsMonitoring(true);
    try {
      const audit = {
        score: 85,
        checks: {
          authentication: true,
          inputValidation: false,
          dataEncryption: true
        },
        recommendations: ["Implement input validation", "Review security policies"]
      };
      setSecurityStatus({
        ...audit,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setIsMonitoring(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!securityStatus) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
          <CardDescription>
            Initializing security audit...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitor
        </CardTitle>
        <CardDescription>
          Last checked: {securityStatus.lastChecked.toLocaleString()}
          {isMonitoring && ' (Monitoring...)'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Security Score</span>
          <Badge className={getScoreBadge(securityStatus.score)}>
            {securityStatus.score.toFixed(0)}%
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Security Checks</h4>
          {Object.entries(securityStatus.checks).map(([check, passed]) => (
            <div key={check} className="flex items-center gap-2 text-sm">
              {passed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className={passed ? 'text-green-700' : 'text-red-700'}>
                {check.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            </div>
          ))}
        </div>

        {securityStatus.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recommendations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {securityStatus.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;
