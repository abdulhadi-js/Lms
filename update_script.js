const fs = require('fs');

// File 1: Fees page
let feesContent = fs.readFileSync('Frontend/app/admin/fees/page.tsx', 'utf-8');

feesContent = feesContent.replace(/Amount \(\$\)/g, 'Amount (Rs.)');
feesContent = feesContent.replace(/Discount \(\$\)/g, 'Discount (Rs.)');
feesContent = feesContent.replace(/Payment Amount \(\$\)/g, 'Payment Amount (Rs.)');
feesContent = feesContent.replace(/Base Amount \(\$\)/g, 'Base Amount (Rs.)');

feesContent = feesContent.replace(/\$\{totalCollected\.toFixed\(2\)\}/g, 'Rs. ${totalCollected.toLocaleString(\'en-PK\')}');
feesContent = feesContent.replace(/\$\{totalOutstanding\.toFixed\(2\)\}/g, 'Rs. ${totalOutstanding.toLocaleString(\'en-PK\')}');

feesContent = feesContent.replace(/\$\{Number\(fee\.amount\)\.toFixed\(2\)\}/g, 'Rs. ${Number(fee.amount).toLocaleString(\'en-PK\')}');
feesContent = feesContent.replace(/Paid: \$\{Number\(fee\.paidAmount\)\.toFixed\(2\)\}/g, 'Paid: Rs. ${Number(fee.paidAmount).toLocaleString(\'en-PK\')}');

feesContent = feesContent.replace(/Search, Plus, DollarSign, AlertCircle, TrendingUp, MoreVertical, Edit, Trash2, CreditCard/g, 'Search, Plus, AlertCircle, TrendingUp, MoreVertical, Edit, Trash2, CreditCard');

feesContent = feesContent.replace(/<DollarSign className="w-6 h-6" \/>/g, '<span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rs</span>');
feesContent = feesContent.replace(/<DollarSign className="w-4 h-4 text-icon-inactive" \/>/g, '<span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rs</span>');

feesContent = feesContent.replace(/status: 'PENDING',\n    discount: '0'\n  \}\);/g, "status: 'PENDING',\n    discount: '0',\n    feeType: 'TUITION'\n  });");

feesContent = feesContent.replace(/title: ''\n  \}\);/g, "title: 'TUITION'\n  });");

feesContent = feesContent.replace(/status: fee\.status \|\| 'PENDING',\n        discount: fee\.discount \|\| '0'\n      \}\);/g, "status: fee.status || 'PENDING',\n        discount: fee.discount || '0',\n        feeType: fee.feeType || 'TUITION'\n      });");

feesContent = feesContent.replace(/status: 'PENDING',\n        discount: '0'\n      \}\);\n    \}/g, "status: 'PENDING',\n        discount: '0',\n        feeType: 'TUITION'\n      });\n    }");

feesContent = feesContent.replace(/discount: Number\(formData\.discount\)\n    \};/g, "discount: Number(formData.discount),\n      feeType: formData.feeType\n    };");

feesContent = feesContent.replace(/title: bulkFormData\.title\n      \}\);/g, "title: bulkFormData.title,\n        feeType: bulkFormData.title\n      });");

feesContent = feesContent.replace(/Track and manage student payments and outstanding balances\./g, "Manage student fee challans, monthly tuition, and outstanding balances.");

feesContent = feesContent.replace(/<th className="py-3 px-4 font-semibold">Student \/ Course<\/th>/g, '<th className="py-3 px-4 font-semibold">Student / Class</th>');

feesContent = feesContent.replace(/Create Invoice/g, 'Create Fee Record');

const badgeHtml = `\{fee.course && <div className="text-xs text-body-secondary">\{fee.course?.title\}</div>\}
                        \{fee.feeType && (
                          <span className={\`inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold \${
                            fee.feeType === 'TUITION' ? 'bg-success/10 text-success' :
                            fee.feeType === 'EXAM' ? 'bg-purple-500/10 text-purple-600' :
                            fee.feeType === 'TRANSPORT' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-gray-500/10 text-gray-600'
                          }\`}>
                            \{fee.feeType\}
                          </span>
                        )\}
                      </div>`;

feesContent = feesContent.replace(/\{fee\.course && <div className="text-xs text-body-secondary">\{fee\.course\?\.title\}<\/div>\}\n                      <\/div>/g, badgeHtml);

const tableBadgeHtml = `\{fee.course && <div className="text-xs text-body-secondary">\{fee.course?.title\}</div>\}
                      \{fee.feeType && (
                        <span className={\`inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold \${
                          fee.feeType === 'TUITION' ? 'bg-success/10 text-success' :
                          fee.feeType === 'EXAM' ? 'bg-purple-500/10 text-purple-600' :
                          fee.feeType === 'TRANSPORT' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-gray-500/10 text-gray-600'
                        }\`}>
                          \{fee.feeType\}
                        </span>
                      )\}
                    </td>`;

feesContent = feesContent.replace(/\{fee\.course && <div className="text-xs text-body-secondary">\{fee\.course\?\.title\}<\/div>\}\n                    <\/td>/g, tableBadgeHtml);

const feeTypeSelect = `<div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Fee Type</label>
                  <select 
                    required
                    className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    value={formData.feeType}
                    onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                  >
                    <option value="TUITION">TUITION — Monthly Tuition Fee</option>
                    <option value="ADMISSION">ADMISSION — Admission Fee</option>
                    <option value="EXAM">EXAM — Exam / Board Fee</option>
                    <option value="TRANSPORT">TRANSPORT — Transport Fee</option>
                    <option value="SPORTS">SPORTS — Sports Fund</option>
                    <option value="LAB">LAB — Lab Charges</option>
                    <option value="LIBRARY">LIBRARY — Library Fee</option>
                    <option value="OTHER">OTHER — Other Charges</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Amount (Rs.)</label>`;

feesContent = feesContent.replace(/<div className="grid grid-cols-2 gap-4">\n                <div>\n                  <label className="block text-sm font-medium text-on-surface mb-1">Amount \(Rs\.\)<\/label>/g, feeTypeSelect);


const bulkFeeTypeSelect = `<div>
                <label className="block text-sm font-medium text-on-surface mb-1">Fee Type</label>
                <select 
                  required
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={bulkFormData.title}
                  onChange={(e) => setBulkFormData({...bulkFormData, title: e.target.value})}
                >
                  <option value="TUITION">TUITION — Monthly Tuition Fee</option>
                  <option value="ADMISSION">ADMISSION — Admission Fee</option>
                  <option value="EXAM">EXAM — Exam / Board Fee</option>
                  <option value="TRANSPORT">TRANSPORT — Transport Fee</option>
                  <option value="SPORTS">SPORTS — Sports Fund</option>
                  <option value="LAB">LAB — Lab Charges</option>
                  <option value="LIBRARY">LIBRARY — Library Fee</option>
                  <option value="OTHER">OTHER — Other Charges</option>
                </select>
              </div>`;

feesContent = feesContent.replace(/<div>\n                <label className="block text-sm font-medium text-on-surface mb-1">Invoice Title<\/label>\n                <input \n                  type="text"\n                  placeholder="e\.g\. October Tuition Fee"\n                  required\n                  className="w-full border border-border-light rounded-lg p-2\.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"\n                  value=\{bulkFormData\.title\}\n                  onChange=\{\(e\) => setBulkFormData\(\{\.\.\.bulkFormData, title: e\.target\.value\}\)\}\n                \/>\n              <\/div>/g, bulkFeeTypeSelect);

feesContent = feesContent.replace(/Generate Bulk Fees/g, 'Generate Monthly Challan');

fs.writeFileSync('Frontend/app/admin/fees/page.tsx', feesContent);


// File 2: Grades page
let gradesContent = fs.readFileSync('Frontend/app/student/grades/page.tsx', 'utf-8');

const newGradeFunc = `function getGradeLabel(percentage: number): { letter: string; color: string; remarks: string } {
  if (percentage >= 90) return { letter: 'A+', color: 'bg-success/10 text-success border border-success/30', remarks: 'Outstanding' };
  if (percentage >= 80) return { letter: 'A', color: 'bg-success/10 text-success border border-success/20', remarks: 'Excellent' };
  if (percentage >= 70) return { letter: 'B', color: 'bg-primary/10 text-primary border border-primary/20', remarks: 'Good' };
  if (percentage >= 60) return { letter: 'C', color: 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20', remarks: 'Satisfactory' };
  if (percentage >= 50) return { letter: 'D', color: 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20', remarks: 'Pass' };
  if (percentage >= 40) return { letter: 'E', color: 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20', remarks: 'Pass (Minimum)' };
  return { letter: 'F', color: 'bg-error/10 text-error border border-error/30', remarks: 'Fail' };
}`;

gradesContent = gradesContent.replace(/function getGradeLabel\(percentage: number\): \{ letter: string; color: string \} \{[\s\S]*?return \{ letter: 'F', color: 'bg-error\/10 text-error' \};\n\}/g, newGradeFunc);

gradesContent = gradesContent.replace(/const \{ letter, color \} = getGradeLabel\(pct\);/g, 'const { letter, color, remarks } = getGradeLabel(pct);');
gradesContent = gradesContent.replace(/<span className=\{\`\$\{color\} px-3 py-0\.5 rounded-full text-xs font-bold\`\}>Grade: \{letter\}<\/span>/g, '<span className={`\${color} px-3 py-0.5 rounded-full text-xs font-bold`}>Grade: {letter} · {remarks}</span>');

const gradingScaleCard = `      {/* Pakistani Grading Scale Reference */}
      <details className="bg-surface border border-divider rounded-xl overflow-hidden group">
        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container transition-colors">
          <div className="flex items-center gap-2 font-semibold text-on-surface">
            <BookOpen className="w-5 h-5 text-primary" />
            Pakistani Grading Scale Reference
          </div>
          <ChevronDown className="w-5 h-5 text-body-secondary group-open:rotate-180 transition-transform" />
        </summary>
        <div className="p-4 border-t border-divider overflow-x-auto bg-surface-container-lowest">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container text-body-secondary text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Grade</th>
                <th className="px-4 py-2">Percentage</th>
                <th className="px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              <tr><td className="px-4 py-2 font-bold text-success">A+</td><td className="px-4 py-2">90-100</td><td className="px-4 py-2">Outstanding</td></tr>
              <tr><td className="px-4 py-2 font-bold text-success">A</td><td className="px-4 py-2">80-89</td><td className="px-4 py-2">Excellent</td></tr>
              <tr><td className="px-4 py-2 font-bold text-primary">B</td><td className="px-4 py-2">70-79</td><td className="px-4 py-2">Good</td></tr>
              <tr><td className="px-4 py-2 font-bold text-[#f59e0b]">C</td><td className="px-4 py-2">60-69</td><td className="px-4 py-2">Satisfactory</td></tr>
              <tr><td className="px-4 py-2 font-bold text-[#f97316]">D</td><td className="px-4 py-2">50-59</td><td className="px-4 py-2">Pass</td></tr>
              <tr><td className="px-4 py-2 font-bold text-[#ef4444]">E</td><td className="px-4 py-2">40-49</td><td className="px-4 py-2">Pass (Minimum)</td></tr>
              <tr><td className="px-4 py-2 font-bold text-error">F</td><td className="px-4 py-2">Below 40</td><td className="px-4 py-2">Fail</td></tr>
            </tbody>
          </table>
        </div>
      </details>
`;

gradesContent = gradesContent.replace(/<\/div>\n\n      \{\/\* Empty State \*\/\}/g, '</div>\n\n' + gradingScaleCard + '\n      {/* Empty State */}');

fs.writeFileSync('Frontend/app/student/grades/page.tsx', gradesContent);


// File 3: Enrollments page
let enrollContent = fs.readFileSync('Frontend/app/admin/enrollments/page.tsx', 'utf-8');

enrollContent = enrollContent.replace(/<button \n            onClick=\{\(\) => setEnrollModalOpen\(true\)\}\n            className="flex items-center gap-2 border border-border-light bg-surface text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"\n          >\n            Direct Enroll\n          <\/button>/g, `<button 
            onClick={() => setEnrollByClassModalOpen(true)}
            className="flex items-center gap-2 border border-border-light bg-surface text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            Enroll by Class
          </button>
          <button 
            onClick={() => setEnrollModalOpen(true)}
            className="flex items-center gap-2 border border-border-light bg-surface text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            Direct Enroll
          </button>`);

enrollContent = enrollContent.replace(/const \[enrollModalOpen, setEnrollModalOpen\] = useState\(false\);/g, `const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollByClassModalOpen, setEnrollByClassModalOpen] = useState(false);
  const [selectedClassForEnroll, setSelectedClassForEnroll] = useState('');`);

const modalStr = `
      {/* Enroll by Class Modal */}
      {enrollByClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-xl shadow-xl p-5 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-heading-on-light mb-2">Bulk Enroll — Assign Class to Subject</h3>
            <p className="text-sm text-body-secondary mb-4">Select a class and a subject to enroll all students of that class into the subject at once.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Class (Course to pull students from)</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selectedClassForEnroll}
                  onChange={(e) => setSelectedClassForEnroll(e.target.value)}
                >
                  <option value="">-- Choose a Class --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Select Subject (Target)</label>
                <select 
                  className="w-full border border-border-light rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">-- Choose a Subject --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              
              {selectedClassForEnroll && (
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-border-light">
                  <p className="text-sm text-on-surface font-medium">Preview</p>
                  <p className="text-xs text-body-secondary mt-1">
                    {enrollments.filter(e => e.course?.id === selectedClassForEnroll && e.status === 'ACTIVE').length} students found in this class.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setEnrollByClassModalOpen(false);
                  setSelectedClassForEnroll('');
                  setSelectedCourse('');
                }}
                className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium hover:bg-surface-container"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!selectedClassForEnroll || !selectedCourse) {
                    toast.error("Please select both a class and a subject.");
                    return;
                  }
                  try {
                    const classStudents = enrollments
                      .filter(e => e.course?.id === selectedClassForEnroll && e.status === 'ACTIVE' && e.student?.id)
                      .map(e => e.student.id);
                      
                    if (classStudents.length === 0) {
                      toast.error("No active students found in the selected class.");
                      return;
                    }
                    
                    await enrollmentsApi.bulkEnroll(selectedCourse, classStudents);
                    toast.success(\`Successfully enrolled \${classStudents.length} students into subject.\`);
                    setEnrollByClassModalOpen(false);
                    setSelectedClassForEnroll('');
                    setSelectedCourse('');
                    fetchData();
                  } catch (err: any) {
                    toast.error(err.message || 'Failed to enroll by class');
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                Enroll All Students in Class &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
`;

enrollContent = enrollContent.replace(/\{\/\* Direct Enroll Modal \*\/\}/g, modalStr + '\n      {/* Direct Enroll Modal */}');

fs.writeFileSync('Frontend/app/admin/enrollments/page.tsx', enrollContent);


// File 4: Gradebook page
let gradebookContent = fs.readFileSync('Frontend/app/teacher/gradebook/page.tsx', 'utf-8');

const stateStr = `const [activeTab, setActiveTab] = useState<'GRADEBOOK' | 'EXAM_ENTRY'>('GRADEBOOK');
  const [examFormData, setExamFormData] = useState({
    examType: 'MONTHLY_TEST',
    totalMarks: 100,
    passingMarks: 40,
    examDate: new Date().toISOString().split('T')[0]
  });
  
  const getPakistaniGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };`;

gradebookContent = gradebookContent.replace(/const \[search, setSearch\] = useState\(''\);/g, `const [search, setSearch] = useState('');\n  ${stateStr}`);

const tabsStr = `
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab('GRADEBOOK')}
          className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${activeTab === 'GRADEBOOK' ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}\`}
        >
          📊 Gradebook
        </button>
        <button
          onClick={() => setActiveTab('EXAM_ENTRY')}
          className={\`px-4 py-2 rounded-md text-sm font-semibold transition-colors \${activeTab === 'EXAM_ENTRY' ? 'bg-surface shadow-sm text-primary' : 'text-body-secondary hover:text-primary'}\`}
        >
          📝 Exam Result Entry
        </button>
      </div>
`;

gradebookContent = gradebookContent.replace(/<div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">/g, tabsStr + '\n      <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">');

const examViewStr = `
        {activeTab === 'EXAM_ENTRY' ? (
          <div className="p-5">
            <div className="mb-6 border-b border-divider pb-6">
              <h3 className="text-xl font-bold text-heading-on-light mb-1">Paper-Based Exam Result Entry</h3>
              <p className="text-sm text-body-secondary mb-6">Enter marks obtained by students in written exams (Monthly Test, Mid-Term, Annual)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Exam Type</label>
                  <select
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.examType}
                    onChange={(e) => setExamFormData({...examFormData, examType: e.target.value})}
                  >
                    <option value="MONTHLY_TEST">MONTHLY_TEST</option>
                    <option value="MID_TERM">MID_TERM</option>
                    <option value="HALF_YEARLY">HALF_YEARLY</option>
                    <option value="ANNUAL">ANNUAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Subject</label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={loading || courses.length === 0}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Total Marks</label>
                  <input
                    type="number"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.totalMarks}
                    onChange={(e) => setExamFormData({...examFormData, totalMarks: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Passing Marks (40%)</label>
                  <input
                    type="number"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.passingMarks}
                    onChange={(e) => setExamFormData({...examFormData, passingMarks: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Exam Date</label>
                  <input
                    type="date"
                    className="w-full bg-surface border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={examFormData.examDate}
                    onChange={(e) => setExamFormData({...examFormData, examDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto border border-divider rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-body-secondary text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">GR No.</th>
                    <th className="py-3 px-4 font-semibold">Marks Obtained</th>
                    <th className="py-3 px-4 font-semibold">Auto-Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-sm">
                  {students.map(student => {
                    const key = \`exam_\${student.id}\`;
                    const score = pendingChanges[key]?.score ?? '';
                    let grade = '-';
                    let pct = 0;
                    if (score !== '' && examFormData.totalMarks > 0) {
                      pct = (Number(score) / examFormData.totalMarks) * 100;
                      grade = getPakistaniGrade(pct);
                    }
                    
                    return (
                      <tr key={student.id} className="hover:bg-surface-container-lowest">
                        <td className="py-3 px-4 font-medium text-on-surface">{student.firstName} {student.lastName}</td>
                        <td className="py-3 px-4 text-body-secondary">{student.grNumber || '-'}</td>
                        <td className="py-3 px-4">
                          <input 
                            type="number"
                            value={score}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                const newChanges = {...pendingChanges};
                                delete newChanges[key];
                                setPendingChanges(newChanges);
                              } else {
                                setPendingChanges({
                                  ...pendingChanges,
                                  [key]: { score: parseFloat(val), isNew: true }
                                });
                              }
                            }}
                            className="w-24 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={\`/ \${examFormData.totalMarks}\`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          {score !== '' && (
                            <span className={\`inline-flex items-center px-2 py-1 rounded text-xs font-bold \${grade === 'F' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}\`}>
                              {grade}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={async () => {
                  setSaving(true);
                  try {
                    const promises = Object.entries(pendingChanges).filter(([k]) => k.startsWith('exam_')).map(async ([key, change]) => {
                      const studentId = key.replace('exam_', '');
                      await marksApi.enterMark({
                        studentId,
                        courseId: selectedCourse,
                        component: examFormData.examType,
                        score: change.score,
                        maxScore: examFormData.totalMarks,
                        weightPercent: 100
                      });
                    });
                    await Promise.all(promises);
                    toast.success('Exam results saved successfully');
                    
                    // clean up pending changes
                    const newChanges = {...pendingChanges};
                    Object.keys(newChanges).forEach(k => {
                      if (k.startsWith('exam_')) delete newChanges[k];
                    });
                    setPendingChanges(newChanges);
                  } catch (err: any) {
                    toast.error('Failed to save exam results');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save All Results'}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
`;

gradebookContent = gradebookContent.replace(/<div className="overflow-x-auto">/g, examViewStr);
gradebookContent = gradebookContent.replace(/<\/div>\n      <\/div>\n    <\/div>/g, '</div>\n        )}\n      </div>\n    </div>');

fs.writeFileSync('Frontend/app/teacher/gradebook/page.tsx', gradebookContent);
